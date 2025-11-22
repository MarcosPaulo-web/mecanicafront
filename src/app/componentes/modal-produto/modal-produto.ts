// src/app/componentes/modal-produto/modal-produto.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Produto, ProdutoRequest } from '../../shared/models/produto.model';

declare var bootstrap: any;

@Component({
  selector: 'app-modal-produto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-produto.html',
  styleUrl: './modal-produto.scss',
})
export class ModalProduto implements OnInit {
  @Input() produto?: Produto;
  @Output() salvar = new EventEmitter<ProdutoRequest>();
  @Output() fechar = new EventEmitter<void>();

  protected form!: FormGroup;
  protected submitted: boolean = false;
  private modal: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.criarForm();

    if (this.produto) {
      this.preencherForm();
    }
  }

  ngOnChanges(): void {
    if (this.produto) {
      this.form.patchValue({
        nmProduto: this.produto.nmProduto,
        dsProduto: this.produto.dsProduto,
        categoria: this.produto.categoria,
        vlCusto: this.produto.vlCusto,
        vlVenda: this.produto.vlVenda,
        qtdEstoque: this.produto.qtdEstoque,
        qtdMinimo: this.produto.qtdMinimo,
      });
    } else {
      // Se abrir para novo produto
      this.form.reset();
    }
  }

  private criarForm(): void {
    this.form = this.fb.group({
      nmProduto: ['', [Validators.required, Validators.maxLength(150)]],
      dsProduto: ['', [Validators.maxLength(500)]],
      categoria: ['', [Validators.maxLength(100)]],
      vlCusto: [0, [Validators.required, Validators.min(0)]],
      vlVenda: [0, [Validators.required, Validators.min(0)]],
      qtdEstoque: [0, [Validators.required, Validators.min(0)]],
      qtdMinimo: [5, [Validators.required, Validators.min(0)]],
    });
  }

  private preencherForm(): void {
    if (this.produto) {
      this.form.patchValue({
        nmProduto: this.produto.nmProduto,
        dsProduto: this.produto.dsProduto,
        categoria: this.produto.categoria,
        vlCusto: this.produto.vlCusto,
        vlVenda: this.produto.vlVenda,
        qtdEstoque: this.produto.qtdEstoque,
        qtdMinimo: this.produto.qtdMinimo,
      });
    }
  }

  abrir(): void {
    const modalElement = document.getElementById('modalProduto');
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

    // Validar se preço de venda é maior que custo
    if (this.form.value.vlVenda <= this.form.value.vlCusto) {
      alert('O preço de venda deve ser maior que o custo!');
      return;
    }

    const produtoData: ProdutoRequest = this.form.value;
    this.salvar.emit(produtoData);
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
    if (control?.hasError('min')) {
      return 'Valor deve ser maior ou igual a zero';
    }
    if (control?.hasError('maxLength')) {
      return 'Tamanho máximo excedido';
    }

    return '';
  }
}
