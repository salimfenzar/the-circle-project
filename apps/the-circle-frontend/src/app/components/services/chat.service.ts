import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/the-circle-frontend/src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket: Socket;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('access_token');
    console.log('[ChatService] Gebruik access_token:', token);

    this.socket = io(environment.dataApiUrl.replace('/api', ''), {
      auth: { token }
    });
  }

  // ✅ Alleen text & streamId nodig – backend haalt user uit token
  sendMessage(message: { text: string; streamId: string }) {
    this.socket.emit('chat-message', message);
  }

  onMessage(callback: (msg: any) => void) {
    this.socket.on('chat-message', callback);
  }

  getMessages(streamId: string) {
    return this.http.get<any[]>(`${environment.dataApiUrl}/chat/${streamId}/messages`);
  }
}
