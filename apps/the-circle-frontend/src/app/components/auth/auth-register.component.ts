import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router, RouterModule } from '@angular/router';
import { UserGender, UserRole } from '../../../../../../libs/shared/src';

@Component({
  selector: 'avans-nx-workshop-auth-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.css']
})
export class AuthRegisterComponent {
  formData = {
    name: '',
    email: '',
    password: '',
    slogan: '',
    avatarUrl: '',
    gender: undefined as UserGender | undefined,
    role: undefined as UserRole | undefined
  };

  genders = Object.values(UserGender);
  roles = Object.values(UserRole);
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = ''; // reset vorige foutmelding

    this.authService.register(this.formData).subscribe({
      next: () => {
        alert('Account succesvol aangemaakt!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registratiefout:', err);

        if (err.status === 409 || (err?.error?.message?.includes('Email already in use'))) {
          this.errorMessage = 'Dit e-mailadres is al in gebruik.';
        } else {
          this.errorMessage = 'Registratie mislukt. Probeer het opnieuw.';
        }
      }
    });
  }
}
