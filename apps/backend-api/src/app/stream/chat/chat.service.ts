import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage } from '../schemas/chat.schema';
import * as crypto from 'crypto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatMessage.name)
    private chatModel: Model<ChatMessage>
  ) {}

  async saveMessage(userId: string, userName: string, text: string, streamId: string, signature: string) {
    console.log('💾 Opslaan bericht ontvangen in ChatService');
    const message = new this.chatModel({ userId, userName, text, streamId });

    if (!this.verifySignature(userId, userName, streamId, text, signature)) {
      throw new Error('Signature mismatch – possible tampering detected.');
    }

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

  private verifySignature(
    userId: string,
    userName: string,
    streamId: string,
    text: string,
    signature: string
  ): boolean {
    const key = 'public-secret-key-known-to-all';
    const message = `${userId}:${userName}:${streamId}:${text}`;
    const expectedSignature = crypto.createHmac('sha256', key).update(message).digest('hex');
    return expectedSignature === signature;
  }
}
