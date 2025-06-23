import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
<<<<<<< HEAD
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService, MongooseModule]
=======
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule), // dit zorgt dat AuthModule beschikbaar is inclusief JwtService via exports
  ],
  controllers: [UserController],
  providers: [UserService, JwtService], // Voeg JwtService toe aan providers
  exports: [UserService],
>>>>>>> 4da00ba32258238f203890fe9fa49221c7619375
})
export class UserModule {}
