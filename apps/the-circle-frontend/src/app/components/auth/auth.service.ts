import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserGender, UserRole } from '../../../../../../libs/shared/src';
import { environment } from 'apps/the-circle-frontend/src/environments/environment';

export interface RegisterDto {
    name: string;
    email: string;
    password: string;
    slogan?: string;
    avatarUrl?: string;
    gender?: UserGender;
    role?: UserRole;
}

export interface LoginDto {
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = environment.dataApiUrl + '/auth';
    private readonly ACCESS_TOKEN = 'access_token';
    private readonly CURRENT_USER = 'currentuser';

    constructor(private http: HttpClient) {}

    register(data: RegisterDto): Observable<any> {
        return this.http.post(`${this.API_URL}/register`, data);
    }

    login(data: LoginDto): Observable<any> {
        return this.http
            .post<{ token: string; user: any }>(`${this.API_URL}/login`, data)
            .pipe(
                tap((response) => {
                    if (response.token) {
                        localStorage.setItem(this.ACCESS_TOKEN, response.token);
                    }
                    if (response.user) {
                        localStorage.setItem(
                            this.CURRENT_USER,
                            JSON.stringify(response.user)
                        );
                    }
                })
            );
    }

    logout(): void {
        localStorage.removeItem(this.ACCESS_TOKEN);
        localStorage.removeItem(this.CURRENT_USER);
    }

    getToken(): string | null {
        return localStorage.getItem(this.ACCESS_TOKEN);
    }

    getCurrentUser(): { rewardSatoshi: number; [key: string]: any } | null {
        const raw = localStorage.getItem(this.CURRENT_USER);
        return raw ? JSON.parse(raw) : null;
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}
