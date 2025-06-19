import {
    Component,
    ElementRef,
    ViewChild,
    inject,
    AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebRTCService } from './webrtc.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'avans-nx-workshop-streaming',
    standalone: true,
    imports: [CommonModule],
    providers: [WebRTCService],
    templateUrl: './streaming.component.html',
    styleUrls: ['./streaming.component.css']
})
export class StreamingComponent implements AfterViewInit {
    @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
    @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

    showLocal = false;
    showRemote = false;
    isStreaming = false;
    streamStartTime: Date | null = null;
    streamDuration: string = '00:00:00';
    currentStreamId: string | null = null;
    private timerInterval: any;

    private webrtc = inject(WebRTCService);
    private http = inject(HttpClient);

    async start(isCaller: boolean) {
        if (this.isStreaming) {
            this.stop();
            return;
        }

        this.showLocal = isCaller;
        this.showRemote = !isCaller;

        await new Promise((resolve) => setTimeout(resolve)); // DOM updaten

        const localStream = await this.webrtc.initLocalStream(isCaller);

        if (localStream && this.localVideo?.nativeElement) {
            this.localVideo.nativeElement.srcObject = localStream;
        }

        await this.webrtc.startConnection();

        const userId = this.getCurrentUserIdFromToken();
        this.http
            .post<any>('http://localhost:3000/streams', {
                userId,
                startTime: new Date()
            })
            .subscribe({
                next: (stream) => {
                    this.currentStreamId = stream._id;
                    this.streamStartTime = new Date();
                    this.startTimer();
                    this.updateStreamDuration();
                    this.isStreaming = true;
                },
                error: (err) => console.error('Stream maken mislukt', err)
            });

        if (this.remoteVideo?.nativeElement) {
            this.remoteVideo.nativeElement.srcObject = this.webrtc.remoteStream;
        }
    }

    stop() {
        this.webrtc.stopConnection();

        if (this.localVideo?.nativeElement) {
            this.localVideo.nativeElement.srcObject = null;
        }
        if (this.remoteVideo?.nativeElement) {
            this.remoteVideo.nativeElement.srcObject = null;
        }

        clearInterval(this.timerInterval);
        this.streamDuration = '00:00:00';
        this.streamStartTime = null;

        if (this.currentStreamId) {
            this.http
                .post<any>(
                    `http://localhost:3000/streams/stop/${this.currentStreamId}`,
                    {}
                )
                .subscribe({
                    next: (res) => {
                        console.log(
                            'Stream gestopt, beloning:',
                            res.reward,
                            'satoshi'
                        );
                        this.currentStreamId = null;
                        this.isStreaming = false;
                    },
                    error: (err) => {
                        console.error('Stoppen van stream mislukt:', err);
                        this.isStreaming = false;
                    }
                });
        } else {
            this.isStreaming = false;
        }
    }

    updateStreamDuration() {
        if (this.streamStartTime) {
            const now = new Date();
            const elapsed = Math.floor(
                (now.getTime() - this.streamStartTime.getTime()) / 1000
            );
            const hours = String(Math.floor(elapsed / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(
                2,
                '0'
            );
            const seconds = String(elapsed % 60).padStart(2, '0');
            this.streamDuration = `${hours}:${minutes}:${seconds}`;
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.updateStreamDuration();
        }, 1000);
    }

    ngAfterViewInit() {
        this.webrtc.onRemoteStreamCallback = (stream) => {
            this.remoteVideo.nativeElement.srcObject = stream;
        };
    }

    getCurrentUserIdFromToken(): string {
        const token = localStorage.getItem('access_token');
        if (!token) return '';
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.sub;
        } catch (e) {
            console.error('Kon userId niet uit token halen');
            return '';
        }
    }
}
