import { Component } from '@angular/core';
import { Auth } from '../../core/auth/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  constructor(private authService: Auth) {}

  onLogout(): void {
    this.authService.logout();
  }
}