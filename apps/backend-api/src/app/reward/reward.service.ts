import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stream } from '../stream/schemas/stream.schema';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class RewardService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    calculateStreamDuration(stream: Stream): number {
        if (!stream.endTime) {
            throw new Error('Stream is nog actief, geen eindtijd beschikbaar.');
        }
        return (stream.endTime.getTime() - stream.startTime.getTime()) / 1000;
    }

    calculateReward(durationInSeconds: number): number {
        if (durationInSeconds <= 0) return 0;
        // return Math.floor(durationInSeconds / 3600); // 1 satoshi per uur
        return Math.floor(durationInSeconds); // per seconde voor test
    }

    async applyRewardToUser(userId: string, reward: number): Promise<void> {
        const user = await this.userModel.findById(userId);
        if (!user) throw new Error('Gebruiker niet gevonden');

        user.rewardSatoshi = (user.rewardSatoshi ?? 0) + reward;
        await user.save();
    }
}
