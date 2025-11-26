import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserRole } from '../../shared/models/usuario.model';

@Component({
  selector: 'app-barra-lateral',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './barra-lateral.html',
  styleUrl: './barra-lateral.scss',
})
export class BarraLateral {
  @Input() role: UserRole = UserRole.ROLE_MECANICO;
  UserRole = UserRole;
}
