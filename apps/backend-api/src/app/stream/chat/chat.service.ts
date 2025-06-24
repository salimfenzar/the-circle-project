import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage } from '../schemas/chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatMessage.name)
    private chatModel: Model<ChatMessage>
  ) {}

  async saveMessage(userId: string, userName: string, text: string, streamId: string) {
    console.log('💾 Opslaan bericht ontvangen in ChatService');
    const message = new this.chatModel({ userId, userName, text, streamId });
    return message.save();
  }

  async getAllMessages() {
    return this.chatModel.find().sort({ createdAt: 1 }); // oudste eerst
  }
  

  
  async getMessagesByStream(streamId: string, limit = 50) {
    return this.chatModel
      .find({ streamId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}
