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

        let totalReward = 0;
        let currentReward = 1;

        // Calculate satoshi per hour
        const hours = Math.floor(durationInSeconds / 5); // Change division for testing purposes (normally 3600 for 1 hour)
        for (let i = 1; i <= hours; i++) {
            totalReward += currentReward;
            console.log(`Sec ${i}: +${currentReward} satoshi`);
            currentReward *= 2;
        }
        return totalReward;
    }

    async applyRewardToUser(userId: string, reward: number): Promise<void> {
        const user = await this.userModel.findById(userId);
        if (!user) throw new Error('Gebruiker niet gevonden');

        user.rewardSatoshi = (user.rewardSatoshi ?? 0) + reward;
        await user.save();
    }
}
