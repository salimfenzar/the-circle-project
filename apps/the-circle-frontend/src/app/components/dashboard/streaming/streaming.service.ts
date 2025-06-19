import { Injectable } from '@angular/core';
import { delay, map, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IStream } from '@avans-nx-workshop/shared';
import { ApiResponse } from '@avans-nx-workshop/shared';
import { environment } from 'apps/the-circle-frontend/src/environments/environment';
import { AuthService } from '../../auth/auth.service';



@Injectable({
  providedIn: 'root',
})
export class StreamService {
  readonly streams: IStream[] = [
  ];

  constructor(private http: HttpClient, private authService: AuthService) {
    console.log('StreamService created');
  }

  createStream(item: IStream, options?: any): Observable<IStream> {
    const token = this.authService.getToken();

    if(!token){
      throw new Error('No token found');
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<IStream>(`${environment.dataApiUrl}/streams`, item, { headers });

  }
  stopStream(item: IStream, options?: any): Observable<IStream> {
    return this.http
      .put<ApiResponse<IStream>>(environment.dataApiUrl + '/Tag/' + item._id, item, { responseType: 'json' })
      .pipe(
        map((response) => response.results),
        tap(console.log)
      );
  }
}
