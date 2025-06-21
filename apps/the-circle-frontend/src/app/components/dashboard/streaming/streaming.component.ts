import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebRTCService } from './webrtc.service';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StreamService } from './streaming.service';

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

  showLocal = false;
  showRemote = false;
  isStreaming = false;
  streamStartTime: Date | null = null;
  streamDuration = '00:00:00';
  private timerInterval: any;
  currentStreamId: string | null = null;


  private webrtc = inject(WebRTCService);
  private chatService = inject(ChatService);
  private route = inject(ActivatedRoute);

  chatMessages: any[] = [];
  newMessage = '';

  userId = 'u123';           // ← vervangen door echte user-id later
  userName = 'Yumnie';       // ← idem
  streamId = '';             // ← dynamisch uit URL
  
  constructor(private http: HttpClient, private streamService: StreamService) {}

  async start(isCaller: boolean) {
    if (this.isStreaming) {
    this.stop();
    return;
  }
  this.showLocal = isCaller;
  this.showRemote = !isCaller;

  
  this.isStreaming = true;
  const localStream = await this.webrtc.initLocalStream(isCaller, "Template name"); // Todo: replace with actual name
  if (localStream) this.localVideo.nativeElement.srcObject = localStream;
  await this.webrtc.startConnection();
  this.remoteVideo.nativeElement.srcObject = this.webrtc.remoteStream;


  this.streamStartTime = new Date();
  this.startTimer();
  this.updateStreamDuration();
  
  if (isCaller) {
      const streamData = {
          startTime: this.streamStartTime,
          title: 'Live Stream',
          isActive: true
      };

      this.streamService.createStream(streamData).subscribe({
          next: (stream) => {
              console.log('Stream created:', stream);
              this.currentStreamId = stream._id ?? null;
              console.log('Current Stream ID:', this.currentStreamId);
          }
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

    this.isStreaming = false;
    clearInterval(this.timerInterval); // ⬅️ deze regel toevoegen
    this.streamDuration = '00:00:00';
    this.streamStartTime = null;
    this.streamService.stopStream(this.currentStreamId ?? '').subscribe({
    next: (stream) => {
      console.log('Stream stopped:', stream);
    }
  });
  this.currentStreamId = null; //reset de huidige stream ID
  }


  updateStreamDuration() {
    if (this.streamStartTime) {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - this.streamStartTime.getTime()) / 1000);
      const hours = String(Math.floor(elapsed / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
      const seconds = String(elapsed % 60).padStart(2, '0');
      this.streamDuration = `${hours}:${minutes}:${seconds}`;
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.updateStreamDuration();
    }, 1000); // elke seconde bijwerken
  }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.streamId = params['id'];
      console.log('Stream ID uit route:', this.streamId);

      // Chatgeschiedenis ophalen
      this.chatService.getMessages(this.streamId).subscribe((msgs) => {
        this.chatMessages = msgs.reverse();
      });

      // Luister realtime naar nieuwe chatberichten
      this.chatService.onMessage((msg) => {
        if (msg.streamId === this.streamId) {
          this.chatMessages.push(msg);
        }
      });
    });
  }

  ngAfterViewInit() {
    this.webrtc.onRemoteStreamCallback = (stream) => {
      this.remoteVideo.nativeElement.srcObject = stream;
    };
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const msg = {
      userId: this.userId,
      userName: this.userName,
      text: this.newMessage,
      streamId: this.streamId,
    };

    this.chatService.sendMessage(msg);
    this.chatMessages.push({ ...msg, timestamp: new Date().toISOString() });
    this.newMessage = '';
  }
}
