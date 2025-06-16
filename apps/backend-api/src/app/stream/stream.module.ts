// streams/stream.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Stream, StreamSchema } from './schemas/stream.schema';
import { StreamService } from './stream.sevice';
import { StreamController } from './stream.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stream.name, schema: StreamSchema }]),
  ],
  controllers: [StreamController],
  providers: [StreamService],
  exports: [StreamService],
})
export class StreamModule {}
