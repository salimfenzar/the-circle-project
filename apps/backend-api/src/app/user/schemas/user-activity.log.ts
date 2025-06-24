import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserActivityLog extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  action: string; // 'follow' or 'unfollow'

  @Prop({ required: true })
  targetUserId: string;
}

export const UserActivityLogSchema = SchemaFactory.createForClass(UserActivityLog);
