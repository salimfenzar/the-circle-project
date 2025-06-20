import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

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

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User | null> {
    return this.userService.findById(id);
  }

  @Post(':id/follow/:streamerId')
  async followStreamer(@Param('id') id: string, @Param('streamerId') streamerId: string) {
    return this.userService.followStreamer(id, streamerId);
  }

  @Post(':id/unfollow/:streamerId')
  async unfollowStreamer(@Param('id') id: string, @Param('streamerId') streamerId: string) {
    return this.userService.unfollowStreamer(id, streamerId);
  }

  @Get(':id/followed')
  async getFollowedStreamers(@Param('id') id: string) {
    return this.userService.getFollowedStreamers(id);
  }
}
