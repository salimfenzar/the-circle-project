import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
   standalone: true,
})
<<<<<<< HEAD
export class NavbarComponent {}
=======
export class NavbarComponent {
   isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
>>>>>>> main
