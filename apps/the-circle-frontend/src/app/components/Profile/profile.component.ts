import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Nodig voor ngIf, ngFor, etc.
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/the-circle-frontend/src/environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],  // Voeg CommonModule toe voor Angular directives
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = null;
  isLoading = true;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.errorMessage = 'Niet ingelogd. Geen toegang tot profiel.';
      this.isLoading = false;
      return;
    }

    this.http.get(`${environment.dataApiUrl}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe({
      next: (data) => {
        this.user = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Fout bij ophalen profiel:', err);
        this.errorMessage = 'Fout bij ophalen profielgegevens.';
        this.isLoading = false;
      }
    });
  }
}
