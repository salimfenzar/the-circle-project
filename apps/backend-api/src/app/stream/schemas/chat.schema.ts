import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // maakt createdAt aan
export class ChatMessage extends Document {
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) userName: string;
  @Prop({ required: true }) text: string;
  @Prop({ required: true }) streamId: string;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
