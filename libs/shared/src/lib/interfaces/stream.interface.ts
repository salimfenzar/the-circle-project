import { IUser } from "./user.interface";

export interface IStream {
  _id?: string;
  startTime: Date;
  endTime?: Date;
  title: string;
  followers?: IUser[];
  isActive: boolean;
  streamer?: IUser;
}

