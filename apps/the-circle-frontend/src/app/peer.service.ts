import { Injectable } from '@angular/core';
import Peer, { DataConnection } from 'peerjs';

@Injectable({
    providedIn: 'root'
})
export class PeerService {
    private peer: Peer;
    private conn?: DataConnection;

    constructor() {
        this.peer = new Peer({
            host: 'localhost',
            port: 9000,
            path: '/'
        });

        this.peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
        });

        this.peer.on('connection', (connection) => {
            this.conn = connection;
            this.conn.on('data', (data) => {
                console.log('Received:', data);
            });
        });
    }

    connectTo(peerId: string) {
        this.conn = this.peer.connect(peerId);
        this.conn.on('open', () => {
            console.log('Connection opened with', peerId);
            this.conn?.send('Hello from the-circle-frontend!');
        });
    }

    getPeer(): Peer {
        return this.peer;
    }

    getConnection(): DataConnection | undefined {
        return this.conn;
    }
}
