import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


@Component({
    selector: 'avans-nx-workshop-app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class NavbarComponent {
  isMobileMenuOpen = false;
  currentStreamId = 'stream123';

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  constructor(private router: Router) {}

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}