import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cliente, ClienteRequest } from '../models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/clientes`;

  listarAtivos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.API_URL);
  }

  buscarPorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.API_URL}/${id}`);
  }

  criar(cliente: ClienteRequest): Observable<Cliente> {
    return this.http.post<Cliente>(this.API_URL, cliente);
  }

  atualizar(id: number, cliente: ClienteRequest): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.API_URL}/${id}`, cliente);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}