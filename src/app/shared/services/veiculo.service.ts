import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Veiculo, VeiculoRequest } from '../models/veiculo.model';

@Injectable({
  providedIn: 'root',
})
export class VeiculoService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/veiculos`;

  listarTodos(): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>(this.API_URL);
  }

  listarPorCliente(cdCliente: number): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>(`${this.API_URL}/cliente/${cdCliente}`);
  }

  buscarPorId(id: number): Observable<Veiculo> {
    return this.http.get<Veiculo>(`${this.API_URL}/${id}`);
  }

  criar(veiculo: VeiculoRequest): Observable<Veiculo> {
    return this.http.post<Veiculo>(this.API_URL, veiculo);
  }

  atualizar(id: number, veiculo: VeiculoRequest): Observable<Veiculo> {
    return this.http.put<Veiculo>(`${this.API_URL}/${id}`, veiculo);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}