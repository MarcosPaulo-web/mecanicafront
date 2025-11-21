import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Produto, ProdutoRequest } from '../models/produto.model';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/produtos`;

  listarAtivos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.API_URL);
  }

  listarEstoqueBaixo(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.API_URL}/estoque-baixo`);
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.API_URL}/${id}`);
  }

  criar(produto: ProdutoRequest): Observable<Produto> {
    return this.http.post<Produto>(this.API_URL, produto);
  }

  atualizar(id: number, produto: ProdutoRequest): Observable<Produto> {
    return this.http.put<Produto>(`${this.API_URL}/${id}`, produto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}