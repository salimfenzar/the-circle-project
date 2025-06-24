import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserActivityLog, UserActivityLogSchema } from './schemas/user-activity.log';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt'; // Zorg dat JwtService beschikbaar is in UserModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule), // dit zorgt dat AuthModule beschikbaar is inclusief JwtService via exports
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserActivityLog.name, schema: UserActivityLogSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtService], // Voeg JwtService toe aan providers
  exports: [UserService],
})
export class UserModule {}

