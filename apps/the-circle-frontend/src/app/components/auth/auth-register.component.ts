import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'avans-nx-workshop-auth-register',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule, MatSnackBarModule],
    templateUrl: './auth-register.component.html',
    styleUrls: ['./auth-register.component.css']
})
export class AuthRegisterComponent {
    formData = {
        name: '',
        email: '',
        password: ''
    };

    @ViewChild('registerForm') registerForm!: NgForm;

    constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

    onSubmit() {
        console.log('Formulier verzonden met:', this.formData);

        this.http
            .post('http://localhost:3000/auth/register', this.formData)
            .subscribe({
                next: () => {
                    this.snackBar.open('Registratie gelukt!', 'Sluiten', {
                        duration: 3000,
                        panelClass: ['snackbar-success']
                    });
                    this.registerForm.resetForm();
                },
                error: (err) => {
                    const message = err.error?.message || 'Registratie mislukt';
                    this.snackBar.open('⚠️ ' + message, 'Sluiten', {
                        duration: 3000,
                        panelClass: ['snackbar-warning']
                    });
                }
            });
    }
}
