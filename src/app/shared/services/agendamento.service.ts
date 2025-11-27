import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AgendamentoResponse, AgendamentoRequest } from '../models/agendamento.model';

@Injectable({
  providedIn: 'root',
})
export class AgendamentoService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/agendamentos`;

  criar(agendamento: AgendamentoRequest): Observable<AgendamentoResponse> {
    return this.http.post<AgendamentoResponse>(this.API_URL, agendamento);
  }

  buscarPorId(id: number): Observable<AgendamentoResponse> {
    return this.http.get<AgendamentoResponse>(`${this.API_URL}/${id}`);
  }

  listarPorMecanico(cdUsuario: number): Observable<AgendamentoResponse[]> {
    return this.http.get<AgendamentoResponse[]>(`${this.API_URL}/mecanico/${cdUsuario}`);
  }

  listarFuturos(): Observable<AgendamentoResponse[]> {
    return this.http.get<AgendamentoResponse[]>(`${this.API_URL}/futuros`);
  }

  atualizar(id: number, agendamento: AgendamentoRequest): Observable<AgendamentoResponse> {
    return this.http.put<AgendamentoResponse>(`${this.API_URL}/${id}`, agendamento);
  }

  cancelar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/${id}/cancelar`, {});
  }
}