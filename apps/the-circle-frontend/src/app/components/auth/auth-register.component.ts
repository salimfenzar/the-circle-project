import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'avans-nx-workshop-auth-register',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './auth-register.component.html',
    styleUrls: ['./auth-register.component.css']
})
export class AuthRegisterComponent {
    formData = {
        name: '',
        email: '',
        password: ''
    };

    constructor(private http: HttpClient) {}

    onSubmit() {
        console.log('Formulier verzonden met:', this.formData);

        this.http
            .post('http://localhost:3000/auth/register', this.formData)
            .subscribe({
                next: (res) => console.log('Registratie gelukt:', res),
                error: (err) => console.error('Fout bij registratie:', err)
            });
    }
}
