import { Component } from '@angular/core';
import { PeerService } from '../../peer.service'; // adjust path if needed

@Component({
    selector: 'app-peer-chat',
    templateUrl: './peer-chat.component.html',
    styleUrls: ['./peer-chat.component.css'],
    standalone: true,
    imports: [
        /* Add Angular modules like FormsModule here if needed */
    ]
})
export class PeerChatComponent {
    myPeerId?: string;
    remotePeerId = '';
    message = '';
    connected = false;
    messages: string[] = [];

    constructor(public peerService: PeerService) {
        this.peerService.getPeer().on('open', (id: string) => {
            this.myPeerId = id;
        });

        this.peerService.getPeer().on('connection', (conn) => {
            this.connected = true;
            this.remotePeerId = conn.peer;

            conn.on('data', (data: any) => {
                this.messages.push(`Remote: ${data}`);
            });
        });
    }

    connect() {
        if (!this.remotePeerId) return;

        this.peerService.connectTo(this.remotePeerId);
        this.connected = true;

        const conn = this.peerService.getConnection(); // Assuming getConnection() is a public method in PeerService
        conn?.on('data', (data: any) => {
            this.messages.push(`Remote: ${data}`);
        });
    }

    sendMessage() {
        const conn = this.peerService.getConnection(); // Assuming getConnection() is a public method in PeerService
        if (this.message && conn && conn.open) {
            conn.send(this.message);
            this.messages.push(`You: ${this.message}`);
            this.message = '';
        }
    }
}
