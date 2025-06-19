// streams/stream.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardService } from '../reward/reward.service';
import { Stream } from './schemas/stream.schema';
import { CreateStreamDto } from './dto/create-stream.dto';

@Injectable()
export class StreamService {
    constructor(
        @InjectModel(Stream.name) private streamModel: Model<Stream>,
        private readonly rewardService: RewardService
    ) {}

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

    async stopStream(streamId: string): Promise<{ reward: number }> {
        const stream = await this.streamModel.findById(streamId);
        if (!stream || !stream.isActive) {
            throw new Error('Stream niet gevonden of al gestopt');
        }

        stream.endTime = new Date();
        stream.isActive = false;

        const duration = this.rewardService.calculateStreamDuration(stream);
        const reward = this.rewardService.calculateReward(duration);

        console.log('Stream userId:', stream.userId);
        await this.rewardService.applyRewardToUser(
            stream.userId.toString(),
            reward
        );
        await stream.save();

        return { reward };
    }
}
