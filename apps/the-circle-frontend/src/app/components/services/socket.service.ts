// socket.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {
    private socket: Socket;

    constructor() {
        console.log('📡 Connecting to socket server...');

        const token = localStorage.getItem('access_token');
        this.socket = io(`http://${window.location.hostname}:3000`, {
            auth: {
                token: token
            }
        });
    }

    getSocket(): Socket {
        return this.socket;
    }
}
