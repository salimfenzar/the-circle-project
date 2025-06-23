import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
  const client = context.switchToWs().getClient<Socket>();
  const token = client.handshake.auth?.token;

  console.log('🔐 Ontvangen token via WebSocket:', token);

  try {
    const payload = this.jwtService.verify(token);
    console.log('✅ Token payload:', payload);
    client.data.user = payload;
    return true;
  } catch (e) {
    console.error('❌ Ongeldig JWT:', e.message);
    return false;
  }
}

}
