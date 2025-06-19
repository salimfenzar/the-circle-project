import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  //private readonly API_URL = 'https://the-circle-project-1.onrender.com/auth';
  private readonly API_URL = environment.dataApiUrl + '/auth';
  private readonly CURRENT_USER = 'currentuser';

  constructor(private http: HttpClient) {}

  register(data: RegisterDto): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  login(data: LoginDto): Observable<any> {
    console.log(this.API_URL);
    return this.http.post(`${this.API_URL}/login`, data);
  }

  getToken(): string | null {
  const token = localStorage.getItem('access_token');
  console.log('access_token:', token);
  return token;
}


}
