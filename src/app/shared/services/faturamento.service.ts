import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Faturamento } from '../models/venda.model';

@Injectable({
  providedIn: 'root',
})
export class FaturamentoService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/faturamento`;

  buscarPorId(id: number): Observable<Faturamento> {
    return this.http.get<Faturamento>(`${this.API_URL}/${id}`);
  }

  listarPorPeriodo(dataInicio: string, dataFim: string): Observable<Faturamento[]> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);
    return this.http.get<Faturamento[]>(`${this.API_URL}/periodo`, { params });
  }

  calcularTotalPeriodo(dataInicio: string, dataFim: string): Observable<{ totalFaturado: number }> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);
    return this.http.get<{ totalFaturado: number }>(`${this.API_URL}/total-periodo`, { params });
  }

  listarDoDia(): Observable<Faturamento[]> {
    return this.http.get<Faturamento[]>(`${this.API_URL}/dia`);
  }

  calcularTotalDia(): Observable<{ totalDia: number }> {
    return this.http.get<{ totalDia: number }>(`${this.API_URL}/total-dia`);
  }
}