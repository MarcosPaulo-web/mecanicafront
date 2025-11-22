// src/app/componentes/modal-cliente/modal-cliente.ts
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Cliente, ClienteRequest } from '../../shared/models/cliente.model';

declare var bootstrap: any;

@Component({
  selector: 'app-modal-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-cliente.html',
  styleUrl: './modal-cliente.scss',
})
export class ModalCliente implements OnInit {
  @Input() cliente?: Cliente;
  @Output() salvar = new EventEmitter<ClienteRequest>();
  @Output() fechar = new EventEmitter<void>();

  protected form!: FormGroup;
  protected submitted: boolean = false;
  private modal: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.criarForm();

    if (this.cliente) {
      this.preencherForm();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cliente'] && changes['cliente'].currentValue) {
      this.preencherForm();
    }

    // Se cliente vier undefined (ex: modo criar), limpar o formulário
    if (changes['cliente'] && !changes['cliente'].currentValue) {
      this.form?.reset();
      this.submitted = false;
    }
  }

  private criarForm(): void {
    this.form = this.fb.group({
      nmCliente: ['', [Validators.required, Validators.maxLength(120)]],
      nuCPF: ['', [Validators.pattern(/^\d{11}$/)]],
      nuTelefone: ['', [Validators.pattern(/^\d{10,11}$/)]],
      dsEndereco: ['', [Validators.maxLength(255)]],
      email: ['', [Validators.email, Validators.maxLength(150)]],
    });
  }

  private preencherForm(): void {
    if (this.cliente) {
      this.form.patchValue({
        nmCliente: this.cliente.nmCliente,
        nuCPF: this.removerFormatacao(this.cliente.nuCPF),
        nuTelefone: this.removerFormatacao(this.cliente.nuTelefone),
        dsEndereco: this.cliente.dsEndereco,
        email: this.cliente.email,
      });
    }
  }

  // Remove formatação (mantém apenas números)
  private removerFormatacao(valor: string | undefined): string {
    if (!valor) return '';
    return valor.replace(/\D/g, '');
  }

  // Aplica máscara de CPF enquanto digita
  onCPFInput(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');

    if (valor.length > 11) {
      valor = valor.substring(0, 11);
    }

    this.form.patchValue({ nuCPF: valor }, { emitEvent: false });

    // Atualiza o campo visual com formatação
    if (valor.length === 11) {
      event.target.value = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      event.target.value = valor;
    }
  }

  // Aplica máscara de telefone enquanto digita
  onTelefoneInput(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');

    if (valor.length > 11) {
      valor = valor.substring(0, 11);
    }

    this.form.patchValue({ nuTelefone: valor }, { emitEvent: false });

    // Atualiza o campo visual com formatação
    if (valor.length === 11) {
      event.target.value = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (valor.length === 10) {
      event.target.value = valor.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      event.target.value = valor;
    }
  }

  abrir(): void {
    const modalElement = document.getElementById('modalCliente');
    this.modal = new bootstrap.Modal(modalElement);
    this.modal.show();
  }

  fecharModal(): void {
    this.modal?.hide();
    this.form.reset();
    this.submitted = false;
    this.fechar.emit();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const clienteData: ClienteRequest = this.form.value;
    this.salvar.emit(clienteData);
  }

  isInvalid(campo: string): boolean {
    const control = this.form.get(campo);
    return (control?.invalid && this.submitted) ?? false;
  }

  getMensagemErro(campo: string): string {
    const control = this.form.get(campo);

    if (control?.hasError('required')) {
      return 'Este campo é obrigatório';
    }
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    if (control?.hasError('pattern')) {
      if (campo === 'nuCPF') {
        return 'CPF deve ter 11 dígitos';
      }
      if (campo === 'nuTelefone') {
        return 'Telefone deve ter 10 ou 11 dígitos';
      }
      return 'Formato inválido';
    }
    if (control?.hasError('maxLength')) {
      return 'Tamanho máximo excedido';
    }

    return '';
  }
}
