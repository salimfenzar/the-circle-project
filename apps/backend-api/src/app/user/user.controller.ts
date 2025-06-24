import {
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

    @UseGuards(AuthGuard('jwt'))
    @Get('current')
    async getCurrent(@Req() req) {
        const user = await this.userService.findById(req.user.userId);
        return { rewardSatoshi: user?.rewardSatoshi ?? 0 };
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<User | null> {
        return this.userService.findById(id);
    }
}
