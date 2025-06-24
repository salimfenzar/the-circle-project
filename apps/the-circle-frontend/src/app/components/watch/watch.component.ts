import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebRTCService } from '../dashboard/streaming/webrtc.service';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../auth/auth.service';

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
  @ViewChild('chatBottom') chatBottom!: ElementRef<HTMLDivElement>;

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

    // ✅ Alle berichten ophalen, zonder filter
    this.chatService.getAllMessages().subscribe((msgs) => {
      console.log('📜 Alle berichten opgehaald:', msgs);
      this.chatMessages = msgs;
      this.scrollToBottom();
    });

    // ✅ Nieuwe live berichten ontvangen
    this.chatService.onMessage((msg) => {
      console.log('[📥 watch.component] Ontvangen bericht:', msg);
      this.chatMessages.push(msg);
      this.chatMessages = [...this.chatMessages];
    });
    this.scrollToBottom();
    setInterval(() => {
      this.chatService.getAllMessages().subscribe((msgs) => {
        this.chatMessages = msgs.reverse();
      });
    }, 15000);
    
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const msg = {
      text: this.newMessage,
      streamId: this.streamId,
    };

    this.chatService.sendMessage(msg);

    this.chatMessages.push({
      ...msg,
      userName: this.userName,
      timestamp: new Date().toISOString(),
    });

    this.newMessage = '';
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatBottom.nativeElement.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Scrollen naar onderen mislukt:', err);
    }
  }
  
}
