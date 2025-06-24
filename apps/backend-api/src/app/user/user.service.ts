import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';

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
    // Log the current database name for debugging
    const dbName = this.userModel.db.name;
    console.log('Current MongoDB database name:', dbName);
    console.log('followStreamer called with:', { userId, streamerId });
    const user = await this.userModel.findById(new mongoose.Types.ObjectId(userId)).exec();
    if (!user) {
      console.error('followStreamer: user not found:', userId);
      return null;
    }
    const result = await this.userModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(userId),
      { $addToSet: { followedStreamers: new mongoose.Types.ObjectId(streamerId) } },
      { new: true }
    ).exec();
    console.log('followStreamer result:', result);
    return result;
  }

  async unfollowStreamer(userId: string, streamerId: string): Promise<User | null> {
    console.log('unfollowStreamer called with:', { userId, streamerId });
    const result = await this.userModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(userId),
      { $pull: { followedStreamers: new mongoose.Types.ObjectId(streamerId) } },
      { new: true }
    ).exec();
    console.log('unfollowStreamer result:', result);
    return result;
  }

  async getFollowedStreamers(userId: string): Promise<User[] | null> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) return null;
    // If followedStreamers is empty, return an empty array
    if (!user.followedStreamers || user.followedStreamers.length === 0) return [];
    // Fetch user objects for all followedStreamers IDs
    const ids = user.followedStreamers.map(id =>
      typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id
    );
    const streamers = await this.userModel.find({ _id: { $in: ids } }).exec();
    return streamers;
  }
}
