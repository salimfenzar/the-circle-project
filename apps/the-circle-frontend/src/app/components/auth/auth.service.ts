import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserGender, UserRole } from '../../../../../../libs/shared/src';
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
  private readonly API_URL = 'https://the-circle-project-1.onrender.com/auth';

  constructor(private http: HttpClient) {}

  register(data: RegisterDto): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  login(data: LoginDto): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, data);
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
