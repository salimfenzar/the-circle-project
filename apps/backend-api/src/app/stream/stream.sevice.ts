// streams/stream.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Stream } from './schemas/stream.schema';
import { CreateStreamDto } from './dto/create-stream.dto';

@Injectable()
export class StreamService {
    constructor(@InjectModel(Stream.name) private streamModel: Model<Stream>) {}

    async create(createStreamDto: CreateStreamDto): Promise<Stream> {
        const created = new this.streamModel(createStreamDto);
        return created.save();
    }

    async findAll(): Promise<Stream[]> {
        return this.streamModel.find().exec();
    }

    async findActive(): Promise<Stream[]> {
        return this.streamModel.find({ isActive: true }).exec();
    }

    async findById(id: string): Promise<Stream | null> {
        return this.streamModel.findById(id).exec();
    }
}
