import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'avans-nx-workshop-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
    followedStreamers: any[] = [];

    constructor(private http: HttpClient, private authService: AuthService, private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
        const userId = this.authService.getCurrentUserId();
        if (userId) {
            this.http.get<any[]>(`http://localhost:3000/users/${userId}/followed`).subscribe({
                next: (streamers) => {
                  console.log('Followed streamers:', streamers);
                  this.followedStreamers = streamers;
                  this.cdr.detectChanges();
                  if (!streamers || streamers.length === 0) {
                    alert('Je volgt nog geen streamers of er is een probleem met de backend data!');
                  }
                },
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
        this.http.post(`http://localhost:3000/users/${userId}/unfollow/${streamerId}`, {}).subscribe({
            next: () => {
                this.followedStreamers = this.followedStreamers.filter(s => s._id !== streamerId);
                alert('Je volgt deze streamer niet meer!');
            },
            error: (err) => alert('Kon streamer niet ontvolgen: ' + err.error?.message || err.message)
        });
    }
}
