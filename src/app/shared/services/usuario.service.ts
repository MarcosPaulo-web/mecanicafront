import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario, UsuarioRequest } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/usuarios`;

  listarAtivos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_URL);
  }

  listarMecanicos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API_URL}/mecanicos`);
  }

  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/${id}`);
  }

  criar(usuario: UsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.API_URL, usuario);
  }

  atualizar(id: number, usuario: UsuarioRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_URL}/${id}`, usuario);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}