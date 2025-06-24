import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { StreamModule } from './stream/stream.module';
import { SignalingGateway } from './stream/signaling.gateway';
import { RewardModule } from './reward/reward.module';

const MONGO_DB_CONNECTION_STRING = process.env.MONGO_URL;
//const MONGO_DB_CONNECTION_STRING = 'mongodb://localhost:27017/the-circle'; //localhost



@Module({
    imports: [
        MongooseModule.forRoot(MONGO_DB_CONNECTION_STRING, {
            connectionFactory: (connection) => {
                connection.on('connected', () => {
                    Logger.verbose(
                        `✅ Mongoose connected to ${MONGO_DB_CONNECTION_STRING}`,
                        'MongoDB'
                    );
                });
                connection.on('error', (err) => {
                    Logger.error(
                        `❌ Mongoose connection error: ${err}`,
                        'MongoDB'
                    );
                });
                return connection;
            }
        }),
        UserModule,
        AuthModule,
        StreamModule,
        RewardModule
    ],
    providers: [SignalingGateway]
})
export class AppModule {}
