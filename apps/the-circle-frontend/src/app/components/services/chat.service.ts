import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { SocketService } from './socket.service';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket: Socket = this.socketService.getSocket();

  constructor(private http: HttpClient, private socketService: SocketService) {
  }

  sendMessage(message: { userId: string; userName: string; text: string; streamId: string }) {
    this.socket.emit('chat-message', message);
  }

  onMessage(callback: (msg: any) => void) {
    this.socket.on('chat-message', callback);
  }

  getMessages(streamId: string) {
    return this.http.get<any[]>(`http://${window.location.hostname}:3000/chat/${streamId}/messages`);
  }
}
