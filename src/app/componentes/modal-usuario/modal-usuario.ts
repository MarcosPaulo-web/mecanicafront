// src/app/componentes/modal-usuario/modal-usuario.ts
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
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
  @Input() usuario?: Usuario; // sempre que muda manda para o ngOnChanges
  @Output() salvar = new EventEmitter<UsuarioRequest>();
  @Output() fechar = new EventEmitter<void>();

  protected form!: FormGroup;
  protected submitted: boolean = false;
  private modal: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form) return; // garante que o form existe

    if (this.usuario) {
      // Edição → senha opcional
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();

      this.form.patchValue({
        nmUsuario: this.usuario.nmUsuario,
        email: this.usuario.email,
        role: this.usuario.roles[0],
        nuTelefone: this.removerFormatacao(this.usuario.nuTelefone),
        nuCPF: this.removerFormatacao(this.usuario.nuCPF),
        password: '',
      });
    } else {
      // Criação → senha obrigatória
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(3)]);
      this.form.get('password')?.updateValueAndValidity();

      this.form.reset();
    }
  }

  protected roles = [
    { valor: 'ROLE_ADMIN', label: 'Administrador' },
    { valor: 'ROLE_ATENDENTE', label: 'Atendente' },
    { valor: 'ROLE_MECANICO', label: 'Mecânico' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.criarForm();
    console.log('Usuario selecionado :' + this.usuario);
    if (this.usuario) {
      this.preencherForm();
    }
  }

  private criarForm(): void {
    this.form = this.fb.group({
      nmUsuario: ['', [Validators.required, Validators.maxLength(120)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      password: [''],
      role: ['', [Validators.required]],
      nuTelefone: ['', [Validators.pattern(/^\d{10,11}$/)]],
      nuCPF: ['', [Validators.pattern(/^\d{11}$/)]],
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
        role: this.usuario.roles[0],
        nuTelefone: this.removerFormatacao(this.usuario.nuTelefone),
        nuCPF: this.removerFormatacao(this.usuario.nuCPF),
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
      if (campo === 'nuCPF') {
        return 'CPF deve ter 11 dígitos';
      }
      if (campo === 'nuTelefone') {
        return 'Telefone deve ter 10 ou 11 dígitos';
      }
      return 'Formato inválido';
    }

    return '';
  }
}
