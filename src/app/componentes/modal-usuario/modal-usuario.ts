// src/app/componentes/modal-usuario/modal-usuario.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario, UsuarioRequest, UserRole, AuthProvider } from '../../shared/models/usuario.model';

declare var bootstrap: any;

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-usuario.html',
  styleUrl: './modal-usuario.scss',
})
export class ModalUsuario implements OnInit {
  @Input() usuario?: Usuario;
  @Output() salvar = new EventEmitter<UsuarioRequest>();
  @Output() fechar = new EventEmitter<void>();

  protected form!: FormGroup;
  protected submitted: boolean = false;
  private modal: any;

  protected roles = [
    { valor: 'ROLE_ADMIN', label: 'Administrador' },
    { valor: 'ROLE_ATENDENTE', label: 'Atendente' },
    { valor: 'ROLE_MECANICO', label: 'Mecânico' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.criarForm();
    
    if (this.usuario) {
      this.preencherForm();
    }
  }

  private criarForm(): void {
    this.form = this.fb.group({
      nmUsuario: ['', [Validators.required, Validators.maxLength(120)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      password: ['', [Validators.minLength(3)]],
      role: ['', [Validators.required]],
      nuTelefone: ['', [Validators.pattern(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/)]],
      nuCPF: ['', [Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
    });

    // Se for edição, a senha não é obrigatória
    if (!this.usuario) {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(3)]);
    }
  }

  private preencherForm(): void {
    if (this.usuario) {
      this.form.patchValue({
        nmUsuario: this.usuario.nmUsuario,
        email: this.usuario.email,
        role: this.usuario.roles[0], // Pega a primeira role
        nuTelefone: this.usuario.nuTelefone,
        nuCPF: this.usuario.nuCPF,
      });
    }
  }

  abrir(): void {
    const modalElement = document.getElementById('modalUsuario');
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

    const formValue = this.form.value;
    
    const usuarioData: UsuarioRequest = {
      nmUsuario: formValue.nmUsuario,
      email: formValue.email,
      password: formValue.password || undefined,
      provider: AuthProvider.LOCAL,
      roles: [formValue.role as UserRole],
      nuTelefone: formValue.nuTelefone || undefined,
      nuCPF: formValue.nuCPF || undefined,
      ativo: true,
    };

    this.salvar.emit(usuarioData);
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
    if (control?.hasError('minLength')) {
      return 'Senha deve ter no mínimo 3 caracteres';
    }
    if (control?.hasError('pattern')) {
      return 'Formato inválido';
    }
    
    return '';
  }
}