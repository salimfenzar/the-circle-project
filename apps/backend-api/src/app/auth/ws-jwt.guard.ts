import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = client.handshake.auth?.token;

    this.logger.log(`🔐 Ontvangen token via WebSocket: ${token}`);

    if (!token) {
      this.logger.warn('⛔ Geen token gevonden in WebSocket handshake');
      throw new UnauthorizedException('Token ontbreekt');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'truyou-secret-key',
      });

      client['user'] = payload;
      this.logger.log(`✅ JWT geverifieerd. Gebruiker: ${payload.name}`);
      return true;
    } catch (err) {
      this.logger.error(`❌ Ongeldig JWT: ${err.message}`);
      throw new UnauthorizedException('Token ongeldig');
    }
  }
}
