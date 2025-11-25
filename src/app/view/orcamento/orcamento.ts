import { Component, OnInit, ViewChild } from '@angular/core';
import { Titulo } from '../../componentes/titulo/titulo';
import { Card } from '../../componentes/card/card';
import { PesquisaFiltro } from '../../componentes/pesquisa-filtro/pesquisa-filtro';
import { OptionDropdown } from '../../shared/models/option-dropdown';
import { Tabela } from '../../componentes/tabela/tabela';
import { CommonModule } from '@angular/common';
import { OrdemServicoService } from '../../shared/services/ordem-servico.service';
import { OrdemServico, TipoServico } from '../../shared/models/ordem-servico.model';
import { Loading } from '../../componentes/loading/loading';
import { ModalOrdemServico } from '../../componentes/modal-ordem-servico/modal-ordem-servico';

@Component({
  selector: 'app-orcamento',
  imports: [Titulo, Card, PesquisaFiltro, Tabela, CommonModule, Loading, ModalOrdemServico],
  templateUrl: './orcamento.html',
  styleUrl: './orcamento.scss',
})
export class Orcamento implements OnInit {
  protected loading: boolean = false;
  protected orcamentos: OrdemServico[] = [];
  protected orcamentosFiltrados: OrdemServico[] = [];

  protected totalOrcamentos: number = 0;
  protected orcamentosPendentes: number = 0;
  protected orcamentosAprovados: number = 0;
  protected orcamentosRecusados: number = 0;
  @ViewChild(ModalOrdemServico) modalOrdem!: ModalOrdemServico;

  protected listFiltro: OptionDropdown[] = [
    new OptionDropdown('Todos os status'),
    new OptionDropdown('Pendente'),
    new OptionDropdown('Aprovado'),
    new OptionDropdown('Recusado'),
  ];

  protected listaCabecario: string[] = [
    'Número',
    'Cliente',
    'Veículo',
    'Emissão',
    'Valor',
    'Status',
    'Ações',
  ];

  constructor(private ordemServicoService: OrdemServicoService) {}

  ngOnInit(): void {
    this.carregarOrcamentos();
  }

  carregarOrcamentos(): void {
    this.loading = true;
    this.ordemServicoService.listarOrcamentosPendentes().subscribe({
      next: (orcamentos) => {
        this.orcamentos = orcamentos;
        this.orcamentosFiltrados = orcamentos;
        this.calcularContadores();
        this.loading = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar orçamentos:', erro);
        alert('Erro ao carregar orçamentos. Tente novamente.');
        this.loading = false;
      },
    });
  }

  calcularContadores(): void {
    this.totalOrcamentos = this.orcamentos.length;
    this.orcamentosPendentes = this.orcamentos.filter((o) => !o.aprovado).length;
    this.orcamentosAprovados = this.orcamentos.filter((o) => o.aprovado).length;
  }

  filtrarPorTexto(termo: string): void {
    if (!termo) {
      this.orcamentosFiltrados = this.orcamentos;
      return;
    }

    termo = termo.toLowerCase();
    this.orcamentosFiltrados = this.orcamentos.filter(
      (orcamento) =>
        orcamento.nmCliente.toLowerCase().includes(termo) ||
        orcamento.placa.toLowerCase().includes(termo) ||
        orcamento.cdOrdemServico.toString().includes(termo)
    );
  }

  filtrarPorStatus(filtro: string): void {
    if (filtro === 'Todos os status') {
      this.orcamentosFiltrados = this.orcamentos;
      return;
    }

    if (filtro === 'Pendente') {
      this.orcamentosFiltrados = this.orcamentos.filter((o) => !o.aprovado);
    } else if (filtro === 'Aprovado') {
      this.orcamentosFiltrados = this.orcamentos.filter((o) => o.aprovado);
    }
  }

  aprovarOrcamento(orcamento: OrdemServico): void {
    if (!confirm(`Aprovar orçamento #${orcamento.cdOrdemServico}?`)) {
      return;
    }

    this.loading = true;
    this.ordemServicoService.aprovarOrcamento(orcamento.cdOrdemServico).subscribe({
      next: () => {
        alert('Orçamento aprovado com sucesso!');
        this.carregarOrcamentos();
      },
      error: (erro) => {
        console.error('Erro ao aprovar orçamento:', erro);
        alert('Erro ao aprovar orçamento. Tente novamente.');
        this.loading = false;
      },
    });
  }

  getStatusOrcamento(orcamento: OrdemServico): string {
    if (orcamento.aprovado) return 'Aprovado';
    return 'Pendente';
  }

  getStatusClass(orcamento: OrdemServico): string {
    if (orcamento.aprovado) return 'bg-success';
    return 'bg-secondary-mecanica';
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  abrirModalNova(): void {
    setTimeout(() => this.modalOrdem.abrir(), 100);
  }

  editar(os: any) {
    this.abrirModalNova();
    this.modalOrdem.abrirParaEdicao(os);
    console.log(os);
  }
}
