import { Component, inject, OnInit } from '@angular/core';
import { OptionDropdown } from '../../shared/models/option-dropdown';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { BarraLateral } from '../barra-lateral/barra-lateral';
import { ThemeService } from '../../shared/services/theme.service';
import { DropdownLink } from '../dropdown-link/dropdown-link';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { UserRole } from '../../shared/models/usuario.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, BarraLateral, DropdownLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  private theme = inject(ThemeService);

  protected nomeUsuario: string = '';
  protected listDropdown: OptionDropdown[] = [];
  protected role: UserRole = UserRole.ROLE_MECANICO;
  protected UserRole = UserRole;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.nomeUsuario = user.nmUsuario;
        this.role = user.roles[0];

        this.setupDropdownOptions();
      }
    });
  }

  private setupDropdownOptions(): void {
    this.listDropdown = [
      {
        label: 'Mudar Tema',
        onClick: () => {
          this.theme.toggleTheme();
        },
      },
      {
        label: 'Sair',
        onClick: () => {
          this.authService.logout();
        },
      },
    ];
  }
}
