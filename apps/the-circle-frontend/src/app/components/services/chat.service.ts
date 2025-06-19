import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3000'); 
  }

  sendMessage(message: { userId: string; userName: string; text: string; streamId: string }) {
    this.socket.emit('chat-message', message);
  }

  onMessage(callback: (msg: any) => void) {
    this.socket.on('chat-message', callback);
  }

  getMessages(streamId: string) {
    return this.http.get<any[]>(`http://localhost:3000/chat/${streamId}/messages`);
  }
}
