import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'avans-nx-workshop-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
    followedStreamers: any[] = [];

    constructor(private http: HttpClient, private authService: AuthService) {}

    ngOnInit(): void {
        const userId = this.authService.getCurrentUserId();
        if (userId) {
            this.http.get<any[]>(`/users/${userId}/followed`).subscribe({
                next: (streamers) => (this.followedStreamers = streamers),
                error: (err) => console.error('Kon gevolgde streamers niet ophalen', err),
            });
        }
    }

    unfollowStreamer(streamerId: string) {
        const userId = this.authService.getCurrentUserId();
        if (!userId) {
            alert('Je moet ingelogd zijn om te ontvolgen.');
            return;
        }
        this.http.post(`/users/${userId}/unfollow/${streamerId}`, {}).subscribe({
            next: () => {
                this.followedStreamers = this.followedStreamers.filter(s => s._id !== streamerId);
                alert('Je volgt deze streamer niet meer!');
            },
            error: (err) => alert('Kon streamer niet ontvolgen: ' + err.error?.message || err.message)
        });
    }
}
