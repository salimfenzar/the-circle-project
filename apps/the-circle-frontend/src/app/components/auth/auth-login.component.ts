import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'avans-nx-workshop-auth-login',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './auth-login.component.html',
    styleUrls: ['./auth-login.component.css']
})
export class AuthLoginComponent {
    formData = {
        email: '',
        password: ''
    };

    constructor(private http: HttpClient) {}

    onSubmit() {
        console.log('Formulier verzonden met:', this.formData);

        // Todo: handle login
        // this.http
        //     .post('http://localhost:3000/auth/login', this.formData)
        //     .subscribe({
        //         next: (res) => console.log('Registratie gelukt:', res),
        //         error: (err) => console.error('Fout bij registratie:', err)
        //     });
    }
}
