import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserGender, UserRole } from '@avans-nx-workshop/shared';
import { environment } from 'apps/the-circle-frontend/src/environments/environment';
import { jwtDecode } from 'jwt-decode';

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

export interface JwtPayload {
  sub: string; // user id
  email: string;
  // add other fields if needed
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.dataApiUrl + '/auth';
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'currentuser';

    constructor(private http: HttpClient) {}

  register(data: RegisterDto): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  login(data: LoginDto): Observable<any> {
    return this.http.post<{ token: string; user: any }>(`${this.API_URL}/login`, data).pipe(
      tap(response => {
        this.saveSession(response.token, response.user);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  saveSession(token: string, user: any) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): { _id: string; name: string; email: string; role: string } | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUserId(): string | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.sub;
    } catch {
      return null;
    }
  }
}
