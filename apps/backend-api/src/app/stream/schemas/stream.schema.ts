// streams/schemas/stream.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Stream extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  title?: string;

  @Prop()
  avatarUrl?: string;

  @Prop()
  slogan?: string;
}

export const StreamSchema = SchemaFactory.createForClass(Stream);
