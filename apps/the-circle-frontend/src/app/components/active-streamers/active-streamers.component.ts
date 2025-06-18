import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-active-streamers',
    standalone: true,
    imports: [CommonModule, HttpClientModule],
    templateUrl: './active-streamers.component.html',
    styleUrls: ['./active-streamers.component.css']
})
export class ActiveStreamersComponent implements OnInit {
    activeStreams: any[] = [];

    constructor(private http: HttpClient) {}

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
}
