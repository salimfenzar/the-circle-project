import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage } from '../schemas/chat.schema';
import * as fs from 'fs';
import * as path from 'path';
import { createSign, createVerify } from 'crypto';

@Injectable()
export class ChatService {
  private privateKey: string;
  private publicKey: string;

  constructor(
    @InjectModel(ChatMessage.name)
    private chatModel: Model<ChatMessage>
  ) {
    // Laad de private en public key bij het opstarten
    const keyDir = path.join(__dirname, '../keys');
    this.privateKey = fs.readFileSync(path.join(keyDir, 'private.pem'), 'utf8');
    this.publicKey = fs.readFileSync(path.join(keyDir, 'public.pem'), 'utf8');
  }

  private signMessage(data: string): string {
    const sign = createSign('SHA256');
    sign.update(data);
    sign.end();
    return sign.sign(this.privateKey, 'base64');
  }

  private verifySignature(data: string, signature: string): boolean {
    const verify = createVerify('SHA256');
    verify.update(data);
    verify.end();
    return verify.verify(this.publicKey, signature, 'base64');
  }

  async saveMessage(userId: string, userName: string, text: string, streamId: string) {
    // Data om te signen (kan aangepast worden, maar volgorde moet altijd gelijk zijn)
    const data = `${userId}|${userName}|${text}|${streamId}`;
    const signature = this.signMessage(data);
    const message = new this.chatModel({ userId, userName, text, streamId, signature });
    return message.save();
  }

  async getMessagesByStream(streamId: string, limit = 50) {
    const messages = await this.chatModel
      .find({ streamId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
    // (Optioneel) verifieer de handtekening bij ophalen
    // messages.forEach(msg => {
    //   const data = `${msg.userId}|${msg.userName}|${msg.text}|${msg.streamId}`;
    //   msg['isSignatureValid'] = this.verifySignature(data, msg.signature);
    // });
    return messages;
  }
}
