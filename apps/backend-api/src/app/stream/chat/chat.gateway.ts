import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private chatService: ChatService) { }

  handleConnection(client: Socket) {
    console.log(`✅ Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('chat-message')
  async handleChatMessage(
    @MessageBody() data: {
      userId: string;
      userName: string;
      text: string;
      streamId: string;
    },
    @ConnectedSocket() client: Socket
  ) {
    await this.chatService.saveMessage(
      data.userId,
      data.userName,
      data.text,
      data.streamId
    );

    this.server.emit('chat-message', {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
}
