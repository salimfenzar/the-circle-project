import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { StreamModule } from './stream/stream.module';
import { SignalingGateway } from './stream/signaling.gateway';

// Je kunt hier ook je eigen config gebruiken via dotenv of environment.ts
const MONGO_DB_CONNECTION_STRING = process.env.MONGO_URL;


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
        StreamModule
    ],
  providers: [SignalingGateway]
})
export class AppModule {}
