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

    async create(
        createStreamDto: CreateStreamDto,
        userId: string
    ): Promise<Stream> {
        createStreamDto.userId = userId;
        const created = new this.streamModel(createStreamDto);
        console.log('created:', created);
        return created.save();
    }

    async findAll(): Promise<Stream[]> {
        return this.streamModel.find().exec();
    }

    async findActive(): Promise<Stream[]> {
        return this.streamModel.find({ isActive: true }).populate('userId').exec();
    }

    async findById(id: string): Promise<Stream | null> {
        return this.streamModel.findById(id).exec();
    }

    async findBySocketId(socketId: string): Promise<Stream | null> {
        return this.streamModel.findOne({ socketId, isActive: true }).exec();
    }

    async endStream(id: string): Promise<{ stream: Stream; reward: number }> {
        const stream = await this.streamModel.findById(id).exec();

        if (!stream) {
            return null;
        }

        stream.isActive = false;
        stream.endTime = new Date();

        const duration = this.rewardService.calculateStreamDuration(stream);
        const reward = this.rewardService.calculateReward(duration);

        await this.rewardService.applyRewardToUser(
            stream.userId.toString(),
            reward
        );
        await stream.save();

        return { stream, reward };
    }

    async joinStream(id: string, userId: string): Promise<Stream | null> {
        return this.streamModel
            .findByIdAndUpdate(
                id,
                { $addToSet: { followers: userId } },
                { new: true }
            )
            .exec();
    }
}
