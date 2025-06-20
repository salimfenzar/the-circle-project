import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StreamingService {
    constructor(private http: HttpClient) {}

    getRewardSatoshi(): Observable<number> {
        return this.http
            .get<{ rewardSatoshi: number }>(
                'http://localhost:3000/users/current'
            )
            .pipe(
                map((res) => {
                    console.log('Response from backend:', res);
                    return res.rewardSatoshi;
                })
            );
    }
}
