import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  OrdemServicoRequestDTO,
  ItemOrdemServicoDTO,
  TipoServico,
} from '../../shared/models/ordem-servico.model';
import { Cliente } from '../../shared/models/cliente.model';
import { Veiculo } from '../../shared/models/veiculo.model';
import { Usuario } from '../../shared/models/usuario.model';
import { Produto } from '../../shared/models/produto.model';
import { Servico } from '../../shared/models/servico.model';
import { ClienteService } from '../../shared/services/cliente.service';
import { VeiculoService } from '../../shared/services/veiculo.service';
import { UsuarioService } from '../../shared/services/usuario.service';
import { ProdutoService } from '../../shared/services/produto.service';
import { ServicoService } from '../../shared/services/servico.service';
import { OrdemServicoService } from '../../shared/services/ordem-servico.service';

declare var bootstrap: any;

@Component({
  selector: 'app-modal-ordem-servico',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modal-ordem-servico.html',
  styleUrl: './modal-ordem-servico.scss',
})
export class ModalOrdemServico implements OnInit {
  @Output() salvar = new EventEmitter<void>();
  @Output() fechar = new EventEmitter<void>();
  @Input({ required: true }) tipo: 'ORDEM_DE_SERVICO' | 'ORCAMENTO' = 'ORDEM_DE_SERVICO';

  protected form!: FormGroup;
  protected submitted: boolean = false;
  protected loading: boolean = false;

  protected clientes: Cliente[] = [];
  protected veiculos: Veiculo[] = [];
  protected mecanicos: Usuario[] = [];
  protected produtos: Produto[] = [];
  protected servicos: Servico[] = [];

  protected itens: ItemOrdemServicoDTO[] = [];
  protected tipoItemSelecionado: 'PRODUTO' | 'SERVICO' = 'PRODUTO';
  protected itemSelecionado: number = 0;
  protected quantidadeSelecionada: number = 1;

  private modal: any;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private veiculoService: VeiculoService,
    private usuarioService: UsuarioService,
    private produtoService: ProdutoService,
    private servicoService: ServicoService,
    private ordemServicoService: OrdemServicoService
  ) {}

  ngOnInit(): void {
    this.criarForm();
    this.carregarDados();
    this.form.get('tipoServico')?.setValue(this.tipo);
    if (this.tipo) {
      this.form.get('tipoServico')?.disable({ emitEvent: false });
    }
  }

  private criarForm(): void {
    this.form = this.fb.group({
      cdCliente: ['', [Validators.required]],
      cdVeiculo: ['', [Validators.required]],
      cdMecanico: ['', [Validators.required]],
      tipoServico: ['', [Validators.required]],
      vlMaoObra: [0, [Validators.min(0)]],
      desconto: [0, [Validators.min(0)]],
      observacoes: [''],
      diagnostico: [''],
    });
  }

  private carregarDados(): void {
    this.clienteService.listarAtivos().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
    });

    this.usuarioService.listarMecanicos().subscribe({
      next: (mecanicos) => {
        this.mecanicos = mecanicos;
      },
    });

    this.produtoService.listarAtivos().subscribe({
      next: (produtos) => {
        this.produtos = produtos.filter((p) => p.qtdEstoque > 0);
      },
    });

    this.servicoService.listarAtivos().subscribe({
      next: (servicos) => {
        this.servicos = servicos;
      },
    });
  }

  onClienteChange(): void {
    const cdCliente = this.form.get('cdCliente')?.value;

    if (cdCliente) {
      this.veiculoService.listarPorCliente(cdCliente).subscribe({
        next: (veiculos) => {
          this.veiculos = veiculos;
          this.form.get('cdVeiculo')?.enable();
        },
      });
    } else {
      this.veiculos = [];
      this.form.get('cdVeiculo')?.setValue('');
      this.form.get('cdVeiculo')?.disable();
    }
  }

  adicionarItem(): void {
    if (!this.itemSelecionado || this.quantidadeSelecionada <= 0) {
      alert('Selecione um item e informe a quantidade');
      return;
    }

    const item: ItemOrdemServicoDTO = {
      quantidade: this.quantidadeSelecionada,
    };

    if (this.tipoItemSelecionado === 'PRODUTO') {
      const produto = this.produtos.find((p) => p.cdProduto === Number(this.itemSelecionado));
      if (!produto) {
        alert('Produto não encontrado');
        return;
      }
      if (this.quantidadeSelecionada > produto.qtdEstoque) {
        alert(`Quantidade indisponível. Estoque atual: ${produto.qtdEstoque}`);
        return;
      }
      item.cdProduto = produto.cdProduto;
    } else {
      const servico = this.servicos.find((s) => s.cdServico === Number(this.itemSelecionado));
      if (!servico) {
        alert('Serviço não encontrado');
        return;
      }
      item.cdServico = servico.cdServico;
    }

    this.itens.push(item);
    this.itemSelecionado = 0;
    this.quantidadeSelecionada = 1;
  }

  removerItem(index: number): void {
    this.itens.splice(index, 1);
  }

  getItemNome(item: ItemOrdemServicoDTO): string {
    if (item.cdProduto) {
      const produto = this.produtos.find((p) => p.cdProduto === item.cdProduto);
      return produto?.nmProduto || '';
    }
    if (item.cdServico) {
      const servico = this.servicos.find((s) => s.cdServico === item.cdServico);
      return servico?.nmServico || '';
    }
    return '';
  }

  getItemValor(item: ItemOrdemServicoDTO): string {
    if (item.cdProduto) {
      const produto = this.produtos.find((p) => p.cdProduto === item.cdProduto);
      return produto?.vlVenda.toFixed(2) || '0.00';
    }
    if (item.cdServico) {
      const servico = this.servicos.find((s) => s.cdServico === item.cdServico);
      return servico?.vlServico.toFixed(2) || '0.00';
    }
    return '0.00';
  }

  getSubtotal(item: ItemOrdemServicoDTO): string {
    let valor = 0;
    if (item.cdProduto) {
      const produto = this.produtos.find((p) => p.cdProduto === item.cdProduto);
      valor = produto?.vlVenda || 0;
    }
    if (item.cdServico) {
      const servico = this.servicos.find((s) => s.cdServico === item.cdServico);
      valor = servico?.vlServico || 0;
    }
    return (valor * item.quantidade).toFixed(2);
  }

  calcularTotal(): number {
    const totalItens = this.itens.reduce((total, item) => {
      let valor = 0;
      if (item.cdProduto) {
        const produto = this.produtos.find((p) => p.cdProduto === item.cdProduto);
        valor = produto?.vlVenda || 0;
      }
      if (item.cdServico) {
        const servico = this.servicos.find((s) => s.cdServico === item.cdServico);
        valor = servico?.vlServico || 0;
      }
      return total + valor * item.quantidade;
    }, 0);

    const maoObra = this.form.get('vlMaoObra')?.value || 0;
    const desconto = this.form.get('desconto')?.value || 0;

    return totalItens + maoObra - desconto;
  }

  abrir(): void {
    const modalElement = document.getElementById('modalOrdemServico');
    this.modal = new bootstrap.Modal(modalElement);
    this.modal.show();
  }

  fecharModal(): void {
    if (this.modal) {
      this.modal.hide();
    }

    this.form.reset({
      tipoServico: this.tipo,
      cdVeiculo: '',
      cdMecanico: '',
      cdCliente: '',
      vlMaoObra: 0,
      desconto: 0,
    });

    this.itens = [];
    this.submitted = false;
    this.fechar.emit();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (this.itens.length === 0) {
      alert('Adicione pelo menos um item (produto ou serviço)');
      return;
    }

    this.loading = true;

    const ordemData: OrdemServicoRequestDTO = {
      cdCliente: parseInt(this.form.value.cdCliente),
      cdVeiculo: parseInt(this.form.value.cdVeiculo),
      cdMecanico: parseInt(this.form.value.cdMecanico),
      tipoServico: this.form.value.tipoServico as TipoServico,
      vlMaoObra: this.form.value.vlMaoObra || 0,
      desconto: this.form.value.desconto || 0,
      observacoes: this.form.value.observacoes,
      diagnostico: this.form.value.diagnostico,
      itens: this.itens,
    };

    this.ordemServicoService.criar(ordemData).subscribe({
      next: () => {
        alert(
          this.form.value.tipoServico === 'ORCAMENTO'
            ? 'Orçamento criado com sucesso!'
            : 'Ordem de serviço criada com sucesso!'
        );
        this.fecharModal();
        this.salvar.emit();
        this.loading = false;
      },
      error: (erro) => {
        console.error('Erro ao criar ordem:', erro);
        alert('Erro ao criar ordem. Verifique os dados e tente novamente.');
        this.loading = false;
      },
    });
  }

  isInvalid(campo: string): boolean {
    const control = this.form.get(campo);
    return (control?.invalid && this.submitted) ?? false;
  }

  abrirParaEdicao(ordem: OrdemServicoRequestDTO): void {
    // Reseta o formulário e os itens antes de preencher
    this.criarForm();
    this.itens = [];
    this.submitted = false;

    // Preenche os valores simples imediatamente
    this.form.patchValue({
      cdCliente: ordem.cdCliente,
      cdMecanico: ordem.cdMecanico,
      tipoServico: ordem.tipoServico,
      vlMaoObra: ordem.vlMaoObra,
      desconto: ordem.desconto,
      observacoes: ordem.observacoes,
      diagnostico: ordem.diagnostico,
    });

    this.veiculoService.listarPorCliente(ordem.cdCliente).subscribe({
      next: (veiculos) => {
        this.veiculos = veiculos;

        this.form.patchValue({
          cdVeiculo: ordem.cdVeiculo,
        });
      },
    });

    this.itens = ordem.itens.map((item) => {
      const novoItem: ItemOrdemServicoDTO = {
        quantidade: item.quantidade,
      };

      if (item.cdProduto) novoItem.cdProduto = item.cdProduto;
      if (item.cdServico) novoItem.cdServico = item.cdServico;

      return novoItem;
    });

    this.form.disable();
  }
}
