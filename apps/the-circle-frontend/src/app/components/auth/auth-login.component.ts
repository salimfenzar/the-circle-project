import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoginDto } from './auth.service';

@Component({
  selector: 'avans-nx-workshop-auth-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.css']
})
export class AuthLoginComponent {
  formData: LoginDto = {
    email: '',
    password: ''
  };

  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';

    this.authService.login(this.formData).subscribe({
      next: (res) => {
        alert('Inloggen gelukt!');
        localStorage.setItem('access_token', res.token);
        console.log('Token opgeslagen:');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Loginfout:', err);
        this.errorMessage =
          err.status === 401
            ? 'Ongeldig e-mailadres of wachtwoord.'
            : 'Inloggen mislukt. Probeer het opnieuw.';
      }
    });
  }
}
