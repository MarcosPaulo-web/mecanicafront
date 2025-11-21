import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Servico, ServicoRequest } from '../models/servico.model';

@Injectable({
  providedIn: 'root',
})
export class ServicoService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/servicos`;

  listarAtivos(): Observable<Servico[]> {
    return this.http.get<Servico[]>(this.API_URL);
  }

  buscarPorId(id: number): Observable<Servico> {
    return this.http.get<Servico>(`${this.API_URL}/${id}`);
  }

  criar(servico: ServicoRequest): Observable<Servico> {
    return this.http.post<Servico>(this.API_URL, servico);
  }

  atualizar(id: number, servico: ServicoRequest): Observable<Servico> {
    return this.http.put<Servico>(`${this.API_URL}/${id}`, servico);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}