import { Component, OnInit, ViewChild } from '@angular/core';
import { Titulo } from '../../componentes/titulo/titulo';
import { PesquisaFiltro } from '../../componentes/pesquisa-filtro/pesquisa-filtro';
import { OptionDropdown } from '../../shared/models/option-dropdown';
import { Tabela } from '../../componentes/tabela/tabela';
import { CommonModule } from '@angular/common';
import { OrdemServicoService } from '../../shared/services/ordem-servico.service';
import { OrdemServico, StatusOrdemServico } from '../../shared/models/ordem-servico.model';
import { Loading } from '../../componentes/loading/loading';
import { ModalOrdemServico } from '../../componentes/modal-ordem-servico/modal-ordem-servico';

@Component({
  selector: 'app-ordens-servico',
  imports: [Titulo, PesquisaFiltro, Tabela, CommonModule, Loading, ModalOrdemServico],
  templateUrl: './ordens-servico.html',
  styleUrl: './ordens-servico.scss',
})
export class OrdensServico implements OnInit {
  @ViewChild(ModalOrdemServico) modalOrdem!: ModalOrdemServico;

  protected loading: boolean = false;
  protected ordens: OrdemServico[] = [];
  protected ordensFiltradas: OrdemServico[] = [];

  protected listFiltro: OptionDropdown[] = [
    new OptionDropdown('Todos os status'),
    new OptionDropdown('Aguardando'),
    new OptionDropdown('Em Andamento'),
    new OptionDropdown('Concluída'),
    new OptionDropdown('Cancelada'),
  ];

  protected cabecalho: string[] = [
    'OS',
    'Cliente',
    'Veículo',
    'Mecânico',
    'Status',
    'Data Abertura',
    'Valor',
    'Ações',
  ];

  constructor(private ordemServicoService: OrdemServicoService) {}

  ngOnInit(): void {
    this.carregarOrdens();
  }

  carregarOrdens(): void {
    this.loading = true;
    this.ordemServicoService.listarPorStatus(StatusOrdemServico.AGUARDANDO).subscribe({
      next: (ordens) => {
        this.ordens = ordens;
        this.ordensFiltradas = ordens;
        this.loading = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar ordens:', erro);
        alert('Erro ao carregar ordens de serviço. Tente novamente.');
        this.loading = false;
      },
    });
  }

  filtrarPorTexto(termo: string): void {
    if (!termo) {
      this.ordensFiltradas = this.ordens;
      return;
    }

    termo = termo.toLowerCase();
    this.ordensFiltradas = this.ordens.filter(
      (ordem) =>
        ordem.nmCliente.toLowerCase().includes(termo) ||
        ordem.placa.toLowerCase().includes(termo) ||
        ordem.cdOrdemServico.toString().includes(termo)
    );
  }

  filtrarPorStatus(filtro: string): void {
    if (filtro === 'Todos os status') {
      this.ordensFiltradas = this.ordens;
      return;
    }

    const statusMap: Record<string, StatusOrdemServico> = {
      'Aguardando': StatusOrdemServico.AGUARDANDO,
      'Em Andamento': StatusOrdemServico.EM_ANDAMENTO,
      'Concluída': StatusOrdemServico.CONCLUIDA,
      'Cancelada': StatusOrdemServico.CANCELADA,
    };

    const status = statusMap[filtro];
    if (status) {
      this.ordensFiltradas = this.ordens.filter((o) => o.statusOrdemServico === status);
    }
  }

  abrirModalNova(): void {
    setTimeout(() => this.modalOrdem.abrir(), 100);
  }

  getStatusClass(status: StatusOrdemServico): string {
    const classes: Record<StatusOrdemServico, string> = {
      [StatusOrdemServico.AGUARDANDO]: 'bg-secondary',
      [StatusOrdemServico.EM_ANDAMENTO]: 'bg-secondary-mecanica',
      [StatusOrdemServico.CONCLUIDA]: 'bg-success',
      [StatusOrdemServico.CANCELADA]: 'bg-danger',
    };
    return classes[status] || 'bg-secondary';
  }

  getStatusLabel(status: StatusOrdemServico): string {
    const labels: Record<StatusOrdemServico, string> = {
      [StatusOrdemServico.AGUARDANDO]: 'Aguardando',
      [StatusOrdemServico.EM_ANDAMENTO]: 'Em Andamento',
      [StatusOrdemServico.CONCLUIDA]: 'Concluída',
      [StatusOrdemServico.CANCELADA]: 'Cancelada',
    };
    return labels[status] || status;
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
}