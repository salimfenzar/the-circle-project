import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { SocketService } from './socket.service';
import { environment } from 'apps/the-circle-frontend/src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket: Socket = this.socketService.getSocket();

  constructor(private http: HttpClient, private socketService: SocketService) {
    this.socket.on('connect', () => {
      console.log('✅ Socket.IO verbonden met ID:', this.socket.id);
    });
  }

  // ✅ Bericht versturen
  sendMessage(message: { text: string; streamId: string; signature: string }) {
    this.socket.emit('chat-message', message);
  }

  // ✅ Berichten ontvangen
  onMessage(callback: (message: any) => void) {
    this.socket.on('chat-message', (msg) => {
      console.log('📨 Bericht ontvangen in ChatService:', msg);
      callback(msg);
    });
  }

  // ✅ Vorige berichten ophalen via HTTP
  getMessages(streamId: string) {
    return this.http.get<any[]>(`http://${window.location.hostname}:3000/chat/${streamId}/messages`);
  }

  // ✅ Startstream event emitten
  emitStartStream(streamId: string) {
    if (streamId) {
      console.log('🚀 Emit "start-stream" met streamId:', streamId);
      this.socket.emit('start-stream', { streamId });
    } else {
      console.warn('⚠️ Geen streamId beschikbaar voor emitStartStream');
    }
  }

  // ✅ Luisteren naar 'stream-info' van server
  onStreamInfo(callback: (data: { streamId: string }) => void) {
    this.socket.on('stream-info', (data) => {
      console.log('ℹ️ stream-info ontvangen:', data);
      callback(data);
    });
  }
  getAllMessages() {
    return this.http.get<any[]>('http://localhost:3000/chat/messages');
  }
  

}
