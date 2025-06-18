import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserGender, UserRole } from '../../../../../../libs/shared/src';

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    passwordHash?: string;

    @Prop()
    slogan?: string;

    @Prop()
    avatarUrl?: string;

    @Prop({ type: String, enum: UserGender, default: UserGender.Unknown })
    gender: UserGender;

    @Prop({ type: String, enum: UserRole, default: UserRole.Follower })
    role: UserRole;

    @Prop({ default: 0 })
    rewardSatoshi: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
