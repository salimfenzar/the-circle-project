import {
<<<<<<< HEAD
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';
=======
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { AuthGuard } from '../auth/auth.guards'; // Zorg dat dit pad klopt
>>>>>>> 4da00ba32258238f203890fe9fa49221c7619375

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

<<<<<<< HEAD
    @UseGuards(AuthGuard('jwt'))
=======

>>>>>>> 4da00ba32258238f203890fe9fa49221c7619375
    @Get('current')
      @UseGuards(AuthGuard)
    async getCurrent(@Req() req) {
        const user = await this.userService.findById(req.user.userId);
        console.log('Current user:', user);
        return { rewardSatoshi: user?.rewardSatoshi ?? 0 };
    }

<<<<<<< HEAD
    @Get(':id')
    async findById(@Param('id') id: string): Promise<User | null> {
        return this.userService.findById(id);
    }
=======
  // Deze route moet **VOOR** de dynamische ':id' route komen
  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: Request & { user: { sub: string } }): Promise<User> {
    // req.user.sub is het userId uit JWT payload, dankzij AuthGuard
    return this.userService.findById(req.user.sub);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User | null> {
    return this.userService.findById(id);
  }
>>>>>>> 4da00ba32258238f203890fe9fa49221c7619375
}
