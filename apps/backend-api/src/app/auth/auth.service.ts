import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email is al in gebruik');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const createdUser = await this.userService.create({
      ...dto,
      passwordHash,
    });

    return createdUser;
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    // ✅ Voeg 'name' toe aan de payload
    const payload = {
      sub: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    // ✅ Return alleen veilige user data
    const safeUser = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return { user: safeUser, token };
  }
}
