import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { WebRTCService } from '../dashboard/streaming/webrtc.service';
import { ChatService } from '../services/chat.service'; // <== voeg toe
import { AuthService } from '../auth/auth.service'; // <== voeg toe

@Component({
  selector: 'avans-nx-workshop-app-watch',
  standalone: true,
  providers: [WebRTCService],
  imports: [CommonModule, FormsModule],
  styleUrls: ['./watch.component.css'],
  templateUrl: './watch.component.html',
})
export class WatchComponent implements OnInit {
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  private webrtc = inject(WebRTCService);
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  streamId = '';
  chatMessages: any[] = [];
  newMessage = '';
  userId = '';
  userName = '';
  rewardSatoshi = 0;
comboMultiplier = 1;
showRemote = true;

  async ngOnInit() {
    this.chatService.onStreamInfo((data: { streamId: string }) => {
      console.log('📡 stream-info ontvangen van server:', data.streamId);
      this.streamId = data.streamId;
      this.webrtc.setTargetId(this.streamId);
    });
    

    await this.webrtc.initLocalStream(false, '');
    await this.webrtc.startConnection();
    this.remoteVideo.nativeElement.srcObject = this.webrtc.remoteStream;

    const user = this.authService.getUser();
    this.userId = user?._id ?? '';
    this.userName = user?.name ?? '';

    // Chat ophalen
    this.chatService.getMessages(this.streamId).subscribe((msgs) => {
      this.chatMessages = msgs.reverse();
    });

    // Live berichten ontvangen
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

  sendMessage() {
    if (!this.newMessage.trim()) return;
    console.log('stremaid:', this.streamId);
    this.chatService.sendMessage({
      text: this.newMessage,
      streamId: this.streamId,
    });
    this.chatMessages.push({
      text: this.newMessage,
      streamId: this.streamId,
      userName: this.userName,
      timestamp: new Date().toISOString(),
    });
    this.newMessage = '';
  }
}
