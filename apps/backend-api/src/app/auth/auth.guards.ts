import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn('Geen token gevonden in Authorization header');
      throw new UnauthorizedException('Geen toegangstoken gevonden');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'truyou-secret-key',
      });

      this.logger.debug(`✅ Geldige JWT: ${JSON.stringify(payload)}`);
      request['user'] = payload; // beschikbaar in controller via @Req()
      return true;
    } catch (err) {
      this.logger.error(`❌ Ongeldig JWT: ${err.message}`);
      throw new UnauthorizedException('JWT verificatie mislukt');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
