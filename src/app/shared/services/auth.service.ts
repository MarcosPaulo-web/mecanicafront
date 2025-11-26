import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'current_user';

  constructor() {
    this.loadUserFromStorage();
  }

  // Login local (email/senha)
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        this.handleAuthSuccess(response);
        console.log(response);
      })
    );
  }

  // Login com Google OAuth2
  loginWithGoogle(): void {
    window.location.href = environment.oauth2.googleAuthUrl;
  }

  handleOAuth2Callback(token: string, email: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);

    this.http.get<Usuario>(`${environment.apiUrl}/auth/me`).subscribe({
      next: (usuario) => {
        const authResponse: AuthResponse = {
          accessToken: token,
          tokenType: 'Bearer',
          usuario: usuario,
        };
        this.handleAuthSuccess(authResponse);
        this.router.navigate(['/home']);
      },
      error: () => {
        console.error('Erro ao buscar dados do usuário');
        localStorage.removeItem(this.TOKEN_KEY);
        this.router.navigate(['/']);
      },
    });
  }

  // Processar sucesso de autenticação
  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.usuario));
    this.currentUserSubject.next(response.usuario);
  }

  // Carregar usuário do storage
  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userJson = localStorage.getItem(this.USER_KEY);

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.logout();
      }
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  // Obter token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // Obter usuário atual
  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  // Verificar se usuário tem role específica
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role as any) ?? false;
  }

  // Verificar se é admin
  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  // Verificar se é atendente
  isAtendente(): boolean {
    return this.hasRole('ROLE_ATENDENTE');
  }

  // Verificar se é mecânico
  isMecanico(): boolean {
    return this.hasRole('ROLE_MECANICO');
  }
}
