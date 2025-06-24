import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './schemas/user.schema';
import { UserActivityLog, UserActivityLogSchema } from './schemas/user-activity.log';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserActivityLog.name, schema: UserActivityLogSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // optioneel, als andere modules UserService gebruiken
})
export class UserModule {}
