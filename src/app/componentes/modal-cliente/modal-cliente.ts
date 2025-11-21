// src/app/componentes/modal-cliente/modal-cliente.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() cliente?: Cliente; // Para edição
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

  private criarForm(): void {
    this.form = this.fb.group({
      nmCliente: ['', [Validators.required, Validators.maxLength(120)]],
      nuCPF: ['', [Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      nuTelefone: ['', [Validators.pattern(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/)]],
      dsEndereco: ['', [Validators.maxLength(255)]],
      email: ['', [Validators.email, Validators.maxLength(150)]],
    });
  }

  private preencherForm(): void {
    if (this.cliente) {
      this.form.patchValue({
        nmCliente: this.cliente.nmCliente,
        nuCPF: this.cliente.nuCPF,
        nuTelefone: this.cliente.nuTelefone,
        dsEndereco: this.cliente.dsEndereco,
        email: this.cliente.email,
      });
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
      return 'Formato inválido';
    }
    if (control?.hasError('maxLength')) {
      return 'Tamanho máximo excedido';
    }
    
    return '';
  }
}