
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/']);
      return false;
    }

    const user = authService.getCurrentUser();
    const hasRole = user?.roles.some(role => allowedRoles.includes(role));

    if (!hasRole) {
      alert('Você não tem permissão para acessar esta página!');
      router.navigate(['/home']);
      return false;
    }

    return true;
  };
};