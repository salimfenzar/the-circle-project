import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Post()
  async postChatMessage(@Body() body: {
    userId: string;
    userName: string;
    text: string;
    streamId: string;
  }) {
    return this.chatService.saveMessage(
      body.userId,
      body.userName,
      body.text,
      body.streamId
    );
  }

  @Get(':streamId/messages')
  async getMessagesByStream(
    @Param('streamId') streamId: string,
    @Query('limit') limit = 50
  ) {
    return this.chatService.getMessagesByStream(streamId, +limit);
  }
  @Get('messages')
  getAllMessages() {
    return this.chatService.getAllMessages();
  }
  

}
