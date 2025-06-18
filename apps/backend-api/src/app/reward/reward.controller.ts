import { Controller, Get, Query } from '@nestjs/common';
import { RewardService } from './reward.service';

@Controller('reward')
export class RewardController {
    constructor(private readonly rewardService: RewardService) {}

    @Get('calc')
    calculateReward(@Query('duration') durationStr: string) {
        const durationInSeconds = parseInt(durationStr, 10);
        if (isNaN(durationInSeconds) || durationInSeconds < 0) {
            return { error: 'Invalid duration parameter' };
        }
        const reward = this.rewardService.calculateReward(durationInSeconds);
        return { durationInSeconds, reward };
    }
}
