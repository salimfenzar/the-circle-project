// streams/dto/create-stream.dto.ts
export class CreateStreamDto {
  userId: string;
  startTime: Date;
  isActive?: boolean;
  title?: string;
}
