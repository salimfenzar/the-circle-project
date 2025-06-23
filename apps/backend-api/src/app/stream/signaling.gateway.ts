// signaling.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { StreamService } from './stream.sevice';
import { Inject } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class SignalingGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    constructor(
        @Inject(StreamService) private readonly streamService: StreamService
    ) {}

    async handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    async handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);

        const stream = await this.streamService.findBySocketId(client.id);
        if (stream) {
            await this.streamService.endStream(stream._id.toString());
            this.server.emit(
                'broadcaster-list',
                await this.streamService.findActive()
            );
            console.log(
                'Broadcaster disconnected and marked inactive in DB:',
                client.id
            );
        }
    }

    @SubscribeMessage('get-broadcasters')
    async handleGetBroadcasters(@ConnectedSocket() client: Socket) {
        const active = await this.streamService.findActive();
        client.emit(
            'broadcaster-list',
            active.map((s) => ({ id: s.socketId, name: s.title }))
        );
    }

  @SubscribeMessage('start-broadcast')
  async handleStartBroadcast(@MessageBody() data: { name: string }, @ConnectedSocket() client: Socket) {
    
    // Emit the clientid back to the creator
    client.emit('broadcast-started', { streamId: client.id });
    
    this.server.emit('broadcaster-list', await this.streamService.findActive());
  }

    @SubscribeMessage('join-broadcast')
    async handleJoinBroadcast(
        @MessageBody() data: { targetId: string },
        @ConnectedSocket() client: Socket
    ) {
        const broadcaster = await this.streamService.findBySocketId(
            data.targetId
        );
        if (broadcaster) {
            this.server.to(data.targetId).emit('watcher', client.id);
            console.log(
                `Watcher ${client.id} joined broadcaster ${data.targetId}`
            );
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
    handleIceCandidate(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket
    ) {
        const { target, candidate } = data;
        this.server
            .to(target)
            .emit('ice-candidate', { candidate, from: client.id });
        // Optionally log ICE candidates
    }
}
