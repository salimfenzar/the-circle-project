import { Controller, Get, Query } from '@nestjs/common';
import { RewardService } from './reward.service';

@Controller('reward')
export class RewardController {
    constructor(private readonly rewardService: RewardService) {}
}
