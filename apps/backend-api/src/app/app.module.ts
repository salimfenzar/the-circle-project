import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { StreamModule } from './stream/stream.module';
import { SignalingGateway } from './stream/signaling.gateway';
import { RewardModule } from './reward/reward.module';
const isProduction = process.env.NODE_ENV === 'production';

const MONGO_DB_CONNECTION_STRING = isProduction
  ? 'mongodb+srv//salimfenzar:Eastpak10@cluster0.whzhx.mongodb.net/recipe?retryWrites=true&w=majority&appName=Cluster0'
  : 'mongodb://localhost:27017/the-circle'; 



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
