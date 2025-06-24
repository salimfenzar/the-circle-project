import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { StreamService } from '../dashboard/streaming/streaming.service';
import { ChatService } from '../services/chat.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'avans-nx-workshop-app-active-streamers',
    standalone: true,
    imports: [CommonModule, HttpClientModule, FormsModule],
    templateUrl: './active-streamers.component.html',
    styleUrls: ['./active-streamers.component.css']
})
export class ActiveStreamersComponent implements OnInit {
    activeStreams: any[] = [];
    chatMessages: { [streamId: string]: any[] } = {};
    newMessages: { [streamId: string]: string } = {};

    constructor(
        private http: HttpClient,
        private router: Router,
        private streamService: StreamService,
        private chatService: ChatService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.http.get<any[]>(`http://${window.location.hostname}:3000/streams/active`).subscribe({
            next: (streams) => {
                this.activeStreams = streams;
                this.activeStreams.forEach(stream => {
                    this.chatService.getMessages(stream._id).subscribe((msgs) => {
                        this.chatMessages[stream._id] = msgs.reverse();
                    });

                    this.chatService.onMessage((msg) => {
                        if (msg.streamId === stream._id) {
                            this.chatMessages[stream._id] = [
                                ...(this.chatMessages[stream._id] || []),
                                msg
                            ];
                        }
                    });
                });
            },
            error: (err) => {
                console.error('Fout bij ophalen streams', err);
            }
        });
    }

    joinStream(streamId: string) {
        const socketId = this.activeStreams.find(stream => stream._id === streamId)?.socketId;
        this.router.navigate(['/watch', socketId]);
        this.streamService.joinStream(streamId).subscribe({
            next: (stream) => {
                console.log('Joined stream:', stream);
            }
        });
    }

    sendMessageToStream(streamId: string) {
        const text = this.newMessages[streamId];
        if (!text?.trim()) return;

        this.chatService.sendMessage({ text, streamId });

        this.chatMessages[streamId] = [
            ...(this.chatMessages[streamId] || []),
            {
                text,
                streamId,
                timestamp: new Date().toISOString(),
                userName: this.authService.getUser()?.name || 'Anon'
            }
        ];

        this.newMessages[streamId] = '';
    }
  
      
}
