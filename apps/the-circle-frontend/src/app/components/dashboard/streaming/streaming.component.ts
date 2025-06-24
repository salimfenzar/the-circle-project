import {
    Component,
    ElementRef,
    ViewChild,
    inject,
    AfterViewInit,
    OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebRTCService } from './webrtc.service';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StreamService } from './streaming.service';
import { filter, first } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import * as crypto from 'crypto';

@Component({
    selector: 'avans-nx-workshop-streaming',
    standalone: true,
    imports: [CommonModule, FormsModule],
    providers: [WebRTCService],
    templateUrl: './streaming.component.html',
    styleUrls: ['./streaming.component.css'],
    
})
export class StreamingComponent implements OnInit, AfterViewInit {
    @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
    @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;
    @ViewChild('chatBottom') chatBottom!: ElementRef<HTMLDivElement>;

    constructor(
        private http: HttpClient,
        private streamService: StreamService
       

    ) {}

    rewardedSatoshi = 0;
    showLocal = false;
    showRemote = false;
    isStreaming = false;
    streamStartTime: Date | null = null;
    streamDuration = '00:00:00';
    currentStreamId: string | null = null;
    rewardSatoshi = 0;
    comboMultiplier = 1;

    private timerInterval: any;
    private webrtc = inject(WebRTCService);
    private chatService = inject(ChatService);
    private route = inject(ActivatedRoute);

    chatMessages: any[] = [];
    newMessage = '';
    private authService = inject(AuthService);

    userId = ''; // ← vervangen door echte user-id later
    userName = ''; // ← idem
    streamId = ''; // ← dynamisch uit URL
  
    ngOnInit(): void {
        const user = this.authService.getUser();
        setInterval(() => {
            this.chatService.getAllMessages().subscribe((msgs) => {
              this.chatMessages = msgs.reverse();
            });
          }, 15000);
        
        if (!user) {
            alert('Je moet ingelogd zijn om te streamen of chatten.');
            return;
        }
        this.userId = user._id;
        this.userName = user.name;
        this.route.params.subscribe((params) => {
            this.streamId = params['id'];
            console.log('Stream ID uit route:', this.streamId);
            

            // Chatgeschiedenis ophalen
            this.chatService.getMessages(this.streamId).subscribe((msgs) => {
                this.chatMessages = msgs;
                this.scrollToBottom();
            });

            
            this.chatService.onMessage((msg) => {
                console.log('[📥 streaming.component] Ontvangen bericht:', msg);
                console.log('[ℹ️ streaming.component] Huidige streamId:', this.streamId);
              
                if (msg.streamId === this.streamId) {
                  console.log('[✅ streaming.component] Bericht hoort bij deze stream');
                  this.chatMessages.push(msg);
                  this.chatMessages = [...this.chatMessages]; 
                } else {
                  console.warn('[🚫 streaming.component] Bericht hoort NIET bij deze stream');
                }
              });
              
              
        });

        // Beloning ophalen bij opstart
        this.streamService.getRewardSatoshi().subscribe({
            next: (reward) => {
                console.log('Reward received from backend:', reward);
                this.rewardSatoshi = reward;
            },
            error: (err) => {
                console.error('Error fetching reward:', err);
            }
        });
    }

    async start(isCaller: boolean) {
        console.log('Start streaming:', isCaller);
        if (this.isStreaming) {
            this.stop();
            return;
        }
        this.showLocal = isCaller;
        this.showRemote = !isCaller;
        this.isStreaming = true;

        const localStream = await this.webrtc.initLocalStream(
            isCaller,
            'Template name'
        ); // Todo: replace with actual name
        if (localStream) this.localVideo.nativeElement.srcObject = localStream;
        await this.webrtc.startConnection();
        this.remoteVideo.nativeElement.srcObject = this.webrtc.remoteStream;

        this.streamStartTime = new Date();
        this.startTimer();
        this.updateStreamDuration();

        if (isCaller) {
            this.webrtc.socketId$
              .pipe(
                filter((id): id is string => !!id),
                first()
              )
              .subscribe((socketId) => {
                const streamData = {
                  startTime: this.streamStartTime!,
                  title: 'Live Stream',
                  socketId,
                  isActive: true
                };
          
                this.streamService.createStream(streamData).subscribe({
                  next: (stream) => {
                    console.log('Stream created:', stream);
                    this.currentStreamId = stream._id ?? null;
                    this.streamId = stream._id ?? '';
                    this.chatService.emitStartStream(this.streamId); // 🔁 stream-info triggeren voor watchers

                    console.log('Current Stream ID:', this.currentStreamId);
                    this.loadAllMessages();

                    

                    // ✅ Verplaats onMessage HIER
                    this.chatService.onMessage((msg) => {
                      console.log('[📥 streaming.component] Ontvangen bericht:', msg);
                      console.log('[ℹ️ streaming.component] Huidige streamId:', this.streamId);
          
                      if (msg.streamId === this.streamId) {
                        console.log('[✅ streaming.component] Bericht hoort bij deze stream');
                        this.chatMessages.push(msg);
                        this.chatMessages = [...this.chatMessages];
                      } else {
                        console.warn('[🚫 streaming.component] Bericht hoort NIET bij deze stream');
                      }
                    });
                  }
                });
              });
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
        this.comboMultiplier = 1;
        this.streamDuration = '00:00:00';
        this.streamStartTime = null;
        this.streamService.stopStream(this.currentStreamId ?? '').subscribe({
            next: (stream) => {
                console.log('Stream stopped:', stream);
            }
        });
        this.currentStreamId = null; //reset de huidige stream ID

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

            // Combo multiplier
            const comboStep = 5; // tijdelijk 5 voor testen, normally 3600
            const comboLevel = Math.floor(elapsed / comboStep);
            this.comboMultiplier = Math.pow(2, comboLevel);
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.updateStreamDuration();
        }, 1000); // elke seconde bijwerken
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



    sendMessage() {
        if (!this.streamId) {
            console.warn('⚠️ Geen streamId beschikbaar – kan geen bericht verzenden.');
            return;
          }

        console.log('🟡 sendMessage wordt aangeroepen');
        console.log('✉️ Bericht:', this.newMessage);
        console.log('📺 streamId in sendMessage:', this.streamId);

        if (!this.newMessage.trim()) return;

        const msg = {
            text: this.newMessage,
            streamId: this.streamId,
            signature: this.signMessage(this.newMessage, this.streamId)
        };

        this.chatService.sendMessage(msg);
        this.chatMessages.push({
            ...msg,
            timestamp: new Date().toISOString(),
            userName: this.userName // optioneel: alleen frontend-display
            
        });
        this.newMessage = '';
        this.scrollToBottom();
    }
    loadAllMessages() {
        if (!this.streamId) {
          console.warn('⚠️ Kan geen berichten laden zonder streamId');
          return;
        }
      
        this.chatService.getAllMessages().subscribe((msgs) => {
        
            this.chatMessages = msgs; // ⛔ alleen voor debug!

        });
        this.scrollToBottom();
      }
      
      scrollToBottom(): void {
        try {
          this.chatBottom.nativeElement.scrollIntoView({ behavior: 'smooth' });
        } catch (err) {
          console.error('Scrollen naar onderen mislukt:', err);
        }
      }
      
 
    public signMessage(text: string, streamId: string): string {
        const key = 'public-secret-key-known-to-all'; // mag niet geheim zijn, wel bekend en constant
        const message = `${this.userId}:${this.userName}:${streamId}:${text}`;
        return crypto.createHmac('sha256', key).update(message).digest('hex');
    }
}
