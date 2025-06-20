// streams/stream.controller.ts
import { Body, Controller, Get, Param, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { StreamService } from './stream.sevice';
import { CreateStreamDto } from './dto/create-stream.dto';
import { Stream } from './schemas/stream.schema';
import { AuthGuard } from '../auth/auth.guards';

@Controller('streams')
export class StreamController {
    constructor(private readonly streamService: StreamService) {}

    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() dto: CreateStreamDto, @Request() req: any): Promise<Stream> {
        console.log('request: ' + req.user.sub);

        const userId = req.user.sub;
        console.log('Creating stream for user:', userId);
        return this.streamService.create(dto, userId);
    }

    @Get()
    async findAll(): Promise<Stream[]> {
        return this.streamService.findAll();
    }

    @Get('active')
    async findActive(): Promise<Stream[]> {
        return this.streamService.findActive();
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<Stream | null> {
        return this.streamService.findById(id);
    }
    @Patch(':id/end')
    async endStream(@Param('id') id: string): Promise<Stream | null> {
        return this.streamService.endStream(id);
    }
    @Patch(':id/join')
    @UseGuards(AuthGuard)
    async joinStream(@Param('id') id: string, @Request() req: any): Promise<Stream | null> {
        const userId = req.user.sub;
        return this.streamService.joinStream(id, userId);
    }


}
