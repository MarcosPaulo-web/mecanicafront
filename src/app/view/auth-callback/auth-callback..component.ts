import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `
    <div class="vh-100 d-flex justify-content-center align-items-center">
      <div class="text-center">
        <div class="spinner-border text-primary-mecanica" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
        <p class="mt-3">Autenticando com Google...</p>
      </div>
    </div>
  `,
})
export class AuthCallback implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    console.log('🔄 AuthCallback iniciado');
    
    this.route.queryParams.subscribe((params) => {
      console.log('📦 Params recebidos:', params);
      
      const token = params['token'];
      const email = params['email'];
      const error = params['error'];

      // ✅ Verificar erro primeiro
      if (error) {
        console.error('❌ Erro no callback:', error);
        alert('Erro: ' + error);
        this.router.navigate(['/']);
        return;
      }

      console.log('🔑 Token:', token ? 'PRESENTE' : 'AUSENTE');
      console.log('📧 Email:', email);

      if (token && email) {
        console.log('✅ Chamando handleOAuth2Callback');
        this.authService.handleOAuth2Callback(token, email);
      } else {
        console.error('❌ Token ou email não encontrado');
        this.router.navigate(['/']);
      }
    });
  }
}

// import { Component, OnInit, inject } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { AuthService } from '../../shared/services/auth.service';

// @Component({
//   selector: 'app-auth-callback',
//   standalone: true,
//   template: `
//     <div class="vh-100 d-flex justify-content-center align-items-center">
//       <div class="text-center">
//         <div class="spinner-border text-primary-mecanica" role="status">
//           <span class="visually-hidden">Carregando...</span>
//         </div>
//         <p class="mt-3">Autenticando com Google...</p>
//       </div>
//     </div>
//   `,
// })
// export class AuthCallback implements OnInit {
//   private route = inject(ActivatedRoute);
//   private authService = inject(AuthService);

//   ngOnInit(): void {
//     this.route.queryParams.subscribe((params) => {
//       const token = params['token'];
//       const email = params['email'];

//       if (token && email) {
//         this.authService.handleOAuth2Callback(token, email);
//       } else {
//         console.error('Token ou email não encontrado na URL');
//         // Redirecionar para login
//       }
//     });
//   }
// }