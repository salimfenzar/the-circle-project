import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../../auth/ws-jwt.guard'; // pas pad aan indien nodig

@WebSocketGateway({ cors: true })
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    const user = client['user'];
    console.log(`✅ Client connected: ${client.id} – User: ${user?.name || 'Unknown'}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('chat-message')
  async handleChatMessage(
    @MessageBody() data: { text: string; streamId: string },
    @ConnectedSocket() client: Socket
  ) {
    const user = client['user'];
    if (!user) {
      console.warn('⛔ Chat message ontvangen zonder geldige gebruiker');
      return;
    }

    const message = {
      userId: user.sub,
      userName: user.name,
      text: data.text,
      streamId: data.streamId,
    };

    await this.chatService.saveMessage(
      message.userId,
      message.userName,
      message.text,
      message.streamId
    );

    this.server.emit('chat-message', {
      ...message,
      timestamp: new Date().toISOString(),
    });
  }
}
