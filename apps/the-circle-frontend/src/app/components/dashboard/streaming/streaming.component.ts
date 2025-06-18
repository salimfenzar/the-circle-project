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

  private webrtc = inject(WebRTCService);
  private chatService = inject(ChatService);
  private route = inject(ActivatedRoute);

  chatMessages: any[] = [];
  newMessage = '';

  userId = 'u123';           // ← vervangen door echte user-id later
  userName = 'Yumnie';       // ← idem
  streamId = '';             // ← dynamisch uit URL

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

  async start(isCaller: boolean) {
    const localStream = await this.webrtc.initLocalStream(isCaller);
    console.log('Local stream initialized:', isCaller);

    this.localVideo.nativeElement.srcObject = localStream ?? null;

    await this.webrtc.startConnection();
    this.remoteVideo.nativeElement.srcObject = this.webrtc.remoteStream;
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
