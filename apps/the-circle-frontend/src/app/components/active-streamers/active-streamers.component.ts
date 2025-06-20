import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { StreamService } from '../dashboard/streaming/streaming.service';

@Component({
    selector: 'avans-nx-workshop-app-active-streamers',
    standalone: true,
    imports: [CommonModule, HttpClientModule],
    templateUrl: './active-streamers.component.html',
    styleUrls: ['./active-streamers.component.css']
})
export class ActiveStreamersComponent implements OnInit {
    activeStreams: any[] = [];

    constructor(private http: HttpClient, private router: Router, private streamService: StreamService) {}

    ngOnInit(): void {
        this.http.get<any[]>('http://localhost:3000/streams/active').subscribe({
            next: (streams) => {
                this.activeStreams = streams;
            },
            error: (err) => {
                console.error('Fout bij ophalen streams', err);
            }
        });
    }

    joinStream(streamId: string) {
        // Redirect to the stream viewing page, passing the stream ID
        this.router.navigate(['/watch', streamId]);
        this.streamService.joinStream(streamId).subscribe({
            next: (stream) => {
                console.log('Joined stream:', stream);
            }
        });

    }
}
