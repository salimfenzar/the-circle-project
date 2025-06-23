import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Stream, StreamSchema } from './schemas/stream.schema';
import { ChatMessage, ChatMessageSchema } from './schemas/chat.schema';

import { StreamService } from './stream.sevice';
import { StreamController } from './stream.controller';
import { SignalingGateway } from './signaling.gateway';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { RewardModule } from '../reward/reward.module';

import { ChatService } from './chat/chat.service';
import { ChatGateway } from './chat/chat.gateway';
import { ChatController } from './chat/chat.controller';
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Stream.name, schema: StreamSchema },
            { name: ChatMessage.name, schema: ChatMessageSchema }
        ]),
        AuthModule,
        JwtModule,
        RewardModule
    ],
    controllers: [StreamController, ChatController],
    providers: [StreamService, SignalingGateway, ChatService, ChatGateway],
    exports: [StreamService]
})
export class StreamModule {}
