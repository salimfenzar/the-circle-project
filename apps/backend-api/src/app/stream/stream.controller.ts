// streams/stream.controller.ts
import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { StreamService } from './stream.sevice';
import { CreateStreamDto } from './dto/create-stream.dto';
import { Stream } from './schemas/stream.schema';

@Controller('streams')
export class StreamController {
    constructor(private readonly streamService: StreamService) {}

    @Post()
    async create(@Body() dto: CreateStreamDto): Promise<Stream> {
        return this.streamService.create(dto);
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
    async joinStream(@Param('id') id: string, @Body('userId') userId: string): Promise<Stream | null> {
        return this.streamService.joinStream(id, userId);
    }


}
