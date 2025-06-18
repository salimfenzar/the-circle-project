// streams/stream.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Stream, StreamSchema } from './schemas/stream.schema';
import { StreamService } from './stream.sevice';
import { StreamController } from './stream.controller';
import { RewardModule } from '../reward/reward.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Stream.name, schema: StreamSchema }
        ]),
        RewardModule
    ],
    controllers: [StreamController],
    providers: [StreamService],
    exports: [StreamService]
})
export class StreamModule {}
