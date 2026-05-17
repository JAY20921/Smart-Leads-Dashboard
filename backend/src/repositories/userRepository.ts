import User, { IUser } from '../models/User';
import { RegisterInput } from '../types';
import { AppError } from '../utils/errorHandler';
import { HTTP_STATUS } from '../constants';

export class UserRepository {
  async findByEmail(email: string, withPassword = false): Promise<IUser | null> {
    const query = User.findOne({ email: email.toLowerCase() });
    if (withPassword) query.select('+password');
    return query.exec();
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).exec();
  }

  async create(input: RegisterInput): Promise<IUser> {
    const existing = await this.findByEmail(input.email);
    if (existing) {
      throw new AppError('Email already in use', HTTP_STATUS.CONFLICT);
    }
    const user = await User.create(input);
    return user;
  }

  async findAll(): Promise<IUser[]> {
    return User.find().select('-password').exec();
  }
}

export const userRepository = new UserRepository();
