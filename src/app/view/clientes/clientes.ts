// src/app/view/clientes/clientes.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Titulo } from '../../componentes/titulo/titulo';
import { InputPesquisa } from '../../componentes/input-pesquisa/input-pesquisa';
import { Tabela } from '../../componentes/tabela/tabela';
import { ModalCliente } from '../../componentes/modal-cliente/modal-cliente';
import { Loading } from '../../componentes/loading/loading';
import { ClienteService } from '../../shared/services/cliente.service';
import { Cliente, ClienteRequest } from '../../shared/models/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, Titulo, InputPesquisa, Tabela, ModalCliente, Loading],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss',
})
export class Clientes implements OnInit {
  @ViewChild(ModalCliente) modalCliente!: ModalCliente;

  protected clientes: Cliente[] = [];
  protected clientesFiltrados: Cliente[] = [];
  protected clienteSelecionado?: Cliente;
  protected loading: boolean = false;
  protected colunas: string[] = ['NOME', 'CPF', 'TELEFONE', 'EMAIL', 'ENDEREÇO', 'AÇÕES'];

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.loading = true;
    this.clienteService.listarAtivos().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.clientesFiltrados = clientes;
        this.loading = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar clientes:', erro);
        alert('Erro ao carregar clientes. Tente novamente.');
        this.loading = false;
      },
    });
  }

  filtrarClientes(termo: string): void {
    if (!termo) {
      this.clientesFiltrados = this.clientes;
      return;
    }

    termo = termo.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(
      (cliente) =>
        cliente.nmCliente.toLowerCase().includes(termo) ||
        cliente.email?.toLowerCase().includes(termo) ||
        cliente.nuCPF?.includes(termo)
    );
  }

  abrirModalNovo(): void {
    this.clienteSelecionado = undefined;
    setTimeout(() => this.modalCliente.abrir(), 100);
  }

  abrirModalEditar(cliente: Cliente): void {
    this.clienteSelecionado = cliente;
    setTimeout(() => this.modalCliente.abrir(), 100);
  }

  salvarCliente(clienteData: ClienteRequest): void {
    this.loading = true;

    if (this.clienteSelecionado) {
      // Editar
      this.clienteService.atualizar(this.clienteSelecionado.cdCliente, clienteData).subscribe({
        next: () => {
          alert('Cliente atualizado com sucesso!');
          this.modalCliente.fecharModal();
          this.carregarClientes();
        },
        error: (erro) => {
          console.error('Erro ao atualizar cliente:', erro);
          alert('Erro ao atualizar cliente. Verifique os dados e tente novamente.');
          this.loading = false;
        },
      });
    } else {
      // Criar novo
      this.clienteService.criar(clienteData).subscribe({
        next: () => {
          alert('Cliente cadastrado com sucesso!');
          this.modalCliente.fecharModal();
          this.carregarClientes();
        },
        error: (erro) => {
          console.error('Erro ao cadastrar cliente:', erro);
          alert('Erro ao cadastrar cliente. Verifique os dados e tente novamente.');
          this.loading = false;
        },
      });
    }
  }

  deletarCliente(cliente: Cliente): void {
    if (!confirm(`Deseja realmente deletar o cliente ${cliente.nmCliente}?`)) {
      return;
    }

    this.loading = true;
    this.clienteService.deletar(cliente.cdCliente).subscribe({
      next: () => {
        alert('Cliente deletado com sucesso!');
        this.carregarClientes();
      },
      error: (erro) => {
        console.error('Erro ao deletar cliente:', erro);
        alert('Erro ao deletar cliente. Tente novamente.');
        this.loading = false;
      },
    });
  }
}