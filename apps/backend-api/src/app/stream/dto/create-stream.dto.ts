// streams/dto/create-stream.dto.ts
export class CreateStreamDto {
  userId: string;
  startTime: Date;
  socketId: string;
  isActive?: boolean;
  title?: string;
  avatarUrl?: string;
  slogan?: string;
}
