import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(user: any): Promise<User> {
    const created = new this.userModel(user);
    return created.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async followStreamer(userId: string, streamerId: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { followedStreamers: streamerId } },
      { new: true }
    ).exec();
  }

  async unfollowStreamer(userId: string, streamerId: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { followedStreamers: streamerId } },
      { new: true }
    ).exec();
  }

  async getFollowedStreamers(userId: string): Promise<User[] | null> {
    const user = await this.userModel.findById(userId).populate({ path: 'followedStreamers', model: 'User' }).exec();
    return user ? (user.followedStreamers as unknown as User[]) : null;
  }
}
