// signaling.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3100, {
  cors: { origin: '*' },
})
export class SignalingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private broadcasterId: string | null = null;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    if (client.id === this.broadcasterId) {
      this.broadcasterId = null;
      this.server.emit('broadcast-stopped');
      console.log('Broadcaster disconnected, broadcast stopped');
    }
  }

  @SubscribeMessage('start-broadcast')
  handleStartBroadcast(@ConnectedSocket() client: Socket) {
    this.broadcasterId = client.id;
    console.log(`Broadcaster started: ${client.id}`);
  }

  @SubscribeMessage('join-broadcast')
  handleJoinBroadcast(@ConnectedSocket() client: Socket) {
    if (this.broadcasterId) {
      this.server.to(this.broadcasterId).emit('watcher', client.id);
      console.log(`Watcher ${client.id} joined, notified broadcaster ${this.broadcasterId}`);
    }
  }

  @SubscribeMessage('offer')
  handleOffer(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const { target, sdp } = data;
    this.server.to(target).emit('offer', { sdp, from: client.id });
    console.log(`Offer from ${client.id} to ${target}`);
  }

  @SubscribeMessage('answer')
  handleAnswer(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const { target, sdp } = data;
    this.server.to(target).emit('answer', { sdp, from: client.id });
    console.log(`Answer from ${client.id} to ${target}`);
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const { target, candidate } = data;
    this.server.to(target).emit('ice-candidate', { candidate, from: client.id });
    // Optionally log ICE candidates
  }
}
