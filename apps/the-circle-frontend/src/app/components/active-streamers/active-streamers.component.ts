import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-active-streamers',
    standalone: true,
    imports: [CommonModule, HttpClientModule],
    templateUrl: './active-streamers.component.html',
    styleUrls: ['./active-streamers.component.css']
})
export class ActiveStreamersComponent implements OnInit {
    activeStreams: any[] = [];

    constructor(private http: HttpClient, private authService: AuthService) {}

    ngOnInit(): void {
        this.http.get<any[]>('https://the-circle-project-1.onrender.com/streams/active').subscribe({
            next: (streams) => {
                this.activeStreams = streams;
            },
            error: (err) => {
                console.error('Fout bij ophalen streams', err);
            }
        });
    }

    followStreamer(streamerId: string) {
        const userId = this.authService.getCurrentUserId();
        if (!userId) {
            alert('Je moet ingelogd zijn om te volgen.');
            return;
        }
        this.http.post(`https://the-circle-project-1.onrender.com/users/${userId}/follow/${streamerId}`, {}).subscribe({
            next: () => alert('Je volgt deze streamer nu!'),
            error: (err) => alert('Kon streamer niet volgen: ' + err.error?.message || err.message)
        });
    }

    unfollowStreamer(streamerId: string) {
        const userId = this.authService.getCurrentUserId();
        if (!userId) {
            alert('Je moet ingelogd zijn om te ontvolgen.');
            return;
        }
        this.http.post(`https://the-circle-project-1.onrender.com/users/${userId}/unfollow/${streamerId}`, {}).subscribe({
            next: () => alert('Je volgt deze streamer niet meer!'),
            error: (err) => alert('Kon streamer niet ontvolgen: ' + err.error?.message || err.message)
        });
    }
}
