import { Injectable } from '@nestjs/common';
import { Stream } from '../stream/schemas/stream.schema';

@Injectable()
export class RewardService {
    calculateStreamDuration(stream: Stream): number {
        if (!stream.endTime) {
            throw new Error('Stream is nog actief, geen eindtijd beschikbaar.');
        }
        return (stream.endTime.getTime() - stream.startTime.getTime()) / 1000;
    }

    // payment 1 satoshi per hour
    calculateReward(durationInSeconds: number): number {
        if (durationInSeconds <= 0) return 0;
        return Math.floor(durationInSeconds / 3600);
    }
}
