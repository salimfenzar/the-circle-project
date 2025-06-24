import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { StreamService } from '../dashboard/streaming/streaming.service';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'avans-nx-workshop-app-active-streamers',
    standalone: true,
    imports: [CommonModule, HttpClientModule],
    templateUrl: './active-streamers.component.html',
    styleUrls: ['./active-streamers.component.css']
})
export class ActiveStreamersComponent implements OnInit {
    activeStreams: any[] = [];

    constructor(private http: HttpClient, private authService: AuthService, private router: Router, private streamService: StreamService) {}

    ngOnInit(): void {
        this.http.get<any[]>(`http://${window.location.hostname}:3000/streams/active`).subscribe({
            next: (streams) => {
                this.activeStreams = streams;
            },
            error: (err) => {
                console.error('Fout bij ophalen streams', err);
            }
        });
    }

    joinStream(streamId: string) {
        // get socketid by streamId
        const socketId = this.activeStreams.find(stream => stream._id === streamId)?.socketId;

        // Redirect to the stream viewing page, passing the stream ID
        this.router.navigate(['/watch', socketId]);
        this.streamService.joinStream(streamId).subscribe({
            next: (stream) => {
                console.log('Joined stream:', stream);
            }
        });
    }

    followStreamer(streamerId: string) {
        const userId = this.authService.getCurrentUserId();
        if (!userId) {
            alert('Je moet ingelogd zijn om te volgen.');
            return;
        }
        this.http.post(`http://${window.location.hostname}:3000/users/${userId}/follow/${streamerId}`, {}).subscribe({
            next: () => alert('Je volgt deze streamer nu!'),
            error: (err) => alert('Kon streamer niet volgen: ' + (err.error?.message || err.message))
        });
    }

    unfollowStreamer(streamerId: string) {
        const userId = this.authService.getCurrentUserId();
        if (!userId) {
            alert('Je moet ingelogd zijn om te ontvolgen.');
            return;
        }
        this.http.post(`http://${window.location.hostname}:3000/users/${userId}/unfollow/${streamerId}`, {}).subscribe({
            next: () => alert('Je volgt deze streamer niet meer!'),
            error: (err) => alert('Kon streamer niet ontvolgen: ' + (err.error?.message || err.message))
        });
    }
}
