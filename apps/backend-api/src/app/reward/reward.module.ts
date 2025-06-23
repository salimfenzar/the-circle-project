import { Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { UserModule } from '../user/user.module';

@Module({
    imports: [UserModule],
    controllers: [RewardController],
    providers: [RewardService],
    exports: [RewardService]
})
export class RewardModule {}
