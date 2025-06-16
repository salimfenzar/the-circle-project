// streams/schemas/stream.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema'; // let op het juiste pad

@Schema({ timestamps: true })
export class Stream extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  title?: string;
}

export const StreamSchema = SchemaFactory.createForClass(Stream);
