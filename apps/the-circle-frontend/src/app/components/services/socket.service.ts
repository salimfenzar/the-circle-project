import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'apps/the-circle-frontend/src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;

  constructor() {
    const token = localStorage.getItem('access_token'); // 🔑 haal token op

    console.log('📡 Connecting to socket server with token...');

    this.socket = io(environment.dataApiUrl, {
      auth: {
        token: token || ''
      }
    });
  }

  getSocket(): Socket {
    return this.socket;
  }
}
