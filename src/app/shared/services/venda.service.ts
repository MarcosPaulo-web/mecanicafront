import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Venda, VendaRequest } from '../models/venda.model';

@Injectable({
  providedIn: 'root',
})
export class VendaService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/vendas`;

  criar(venda: VendaRequest): Observable<Venda> {
    return this.http.post<Venda>(this.API_URL, venda);
  }

  buscarPorId(id: number): Observable<Venda> {
    return this.http.get<Venda>(`${this.API_URL}/${id}`);
  }

  listarTodas(): Observable<Venda[]> {
    return this.http.get<Venda[]>(this.API_URL);
  }

  listarPorCliente(cdCliente: number): Observable<Venda[]> {
    return this.http.get<Venda[]>(`${this.API_URL}/cliente/${cdCliente}`);
  }

  listarPorAtendente(cdAtendente: number): Observable<Venda[]> {
    return this.http.get<Venda[]>(`${this.API_URL}/atendente/${cdAtendente}`);
  }

  listarPorPeriodo(dataInicio: string, dataFim: string): Observable<Venda[]> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);
    return this.http.get<Venda[]>(`${this.API_URL}/periodo`, { params });
  }

  calcularTotalDia(): Observable<{ totalDia: number }> {
    return this.http.get<{ totalDia: number }>(`${this.API_URL}/total-dia`);
  }
}