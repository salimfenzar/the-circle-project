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
    cors: { origin: '*' }
})
export class SignalingGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    constructor(
        @Inject(StreamService) private readonly streamService: StreamService
    ) {}
    private watchersMap: Map<string, Set<string>> = new Map();

    async handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    async handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
        //remove watcher when he disconnects
        for (const [broadcasterId, watchers] of this.watchersMap.entries()) {
            if (watchers.has(client.id)) {
                watchers.delete(client.id);
                const count = watchers.size;
                this.server.to(broadcasterId).emit('viewer-count', count);
                console.log(
                    `Watcher ${client.id} removed from ${broadcasterId} (viewers: ${count})`
                );
                if (count === 0) {
                    this.watchersMap.delete(broadcasterId);
                }
            }
        }

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
            this.watchersMap.delete(client.id); //if the broadcaster disconnects, remove their watchers
            console.log(`Removed watchers for broadcaster ${client.id}`);
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
    async handleStartBroadcast(
        @MessageBody() data: { name: string },
        @ConnectedSocket() client: Socket
    ) {
        // Emit the clientid back to the creator
        client.emit('broadcast-started', { streamId: client.id });

        this.server.emit(
            'broadcaster-list',
            await this.streamService.findActive()
        );
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
            if (!this.watchersMap.has(data.targetId)) {
                this.watchersMap.set(data.targetId, new Set());
            }
            this.watchersMap.get(data.targetId)?.add(client.id);
            this.server.to(data.targetId).emit('watcher', client.id);
            const count = this.watchersMap.get(data.targetId)?.size || 0;
            this.server.to(data.targetId).emit('viewer-count', count);
            console.log(`Watcher ${client.id} joined broadcaster ${data.targetId} - Total viewers: ${count}`);
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
