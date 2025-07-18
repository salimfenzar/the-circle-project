import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { StreamService } from '../dashboard/streaming/streaming.service';
import { environment } from 'apps/the-circle-frontend/src/environments/environment';


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
         this.http.get<any[]>(`${environment.dataApiUrl}/streams/active`).subscribe({
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
}
