export enum StatusOrdemServico {
  AGUARDANDO = 'AGUARDANDO',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
}

export enum TipoServico {
  ORCAMENTO = 'ORCAMENTO',
  ORDEM_DE_SERVICO = 'ORDEM_DE_SERVICO',
}

export enum FormaPagamento {
  DINHEIRO,
  CARTAO_CREDITO,
  CARTAO_DEBITO,
  PIX,
}
export interface OrdemServico {
  cdOrdemServico: number;
  cdCliente: number;
  nmCliente: string;
  cdVeiculo: number;
  placa: string;
  cdUsuario: number;
  nmMecanico: string;
  tipoServico: TipoServico;
  formaPagamento: FormaPagamento;
  statusOrdemServico: StatusOrdemServico;
  dataAbertura: string;
  dataFechamento?: string;
  vlPecas: number;
  vlMaoObra: number;
  vlTotal: number;
  desconto: number;
  observacoes?: string;
  diagnostico?: string;
  aprovado: boolean;

  // ✅ ADICIONAR AQUI
  itens: ItemOrdemServicoDTO[];
}

export interface ItemOrdemServico {
  cdItemOrdemServico: number;
  cdProduto?: number;
  nmProduto?: string;
  cdServico?: number;
  nmServico?: string;
  quantidade: number;
  vlUnitario: number;
  vlTotal: number;
}

export interface ItemOrdemServicoDTO {
  cdProduto?: number;
  cdServico?: number;
  quantidade: number;
}

export interface OrdemServicoRequestDTO {
  cdCliente: number;
  cdVeiculo: number;
  cdUsuario: number;
  tipoServico: TipoServico;
  FormaPagamento: FormaPagamento;
  vlMaoObra?: number;
  desconto?: number;
  observacoes?: string;
  diagnostico?: string;
  itens: ItemOrdemServicoDTO[];
}
