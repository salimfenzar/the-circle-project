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

  // Map to keep track of connected broadcasters and their display names
  private broadcasters: Map<string, string> = new Map(); // socketId -> displayName

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    if (this.broadcasters.delete(client.id)) {
      this.server.emit('broadcaster-list', Array.from(this.broadcasters.entries()).map(([id, name]) => ({ id, name })));
      console.log('Broadcaster removed:', client.id);
    }
  }

  @SubscribeMessage('get-broadcasters')
    handleGetBroadcasters(@ConnectedSocket() client: Socket) {
    client.emit('broadcaster-list', Array.from(this.broadcasters.entries()).map(([id, name]) => ({ id, name })));
  }

  @SubscribeMessage('start-broadcast')
    handleStartBroadcast(@MessageBody() data: { name: string }, @ConnectedSocket() client: Socket) {
    this.broadcasters.set(client.id, data.name);
    this.server.emit('broadcaster-list', Array.from(this.broadcasters.entries()).map(([id, name]) => ({ id, name })));
    console.log(`Broadcaster started: ${client.id} (${data.name})`);
}

  @SubscribeMessage('join-broadcast')
  handleJoinBroadcast(@MessageBody() data: { targetId: string }, @ConnectedSocket() client: Socket) {
    if (this.broadcasters.has(data.targetId)) {
      this.server.to(data.targetId).emit('watcher', client.id);
      console.log(`Watcher ${client.id} joined broadcaster ${data.targetId}`);
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
