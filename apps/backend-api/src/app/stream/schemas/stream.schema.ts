// streams/schemas/stream.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../user/schemas/user.schema'; // let op het juiste pad

@Schema({ timestamps: true })
export class Stream extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  startTime: Date;

  @Prop()
  endTime?: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  title?: string;

  @Prop({ type: [{type: MongooseSchema.Types.ObjectId, ref: 'User'}]})
  followers?: User[];
}

export const StreamSchema = SchemaFactory.createForClass(Stream);
