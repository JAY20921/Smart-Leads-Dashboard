import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository';
import { RegisterInput, LoginInput, JwtPayload } from '../types';
import { IUser } from '../models/User';
import { AppError } from '../utils/errorHandler';
import { HTTP_STATUS } from '../constants';

const signToken = (user: IUser): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d';
  if (!secret) throw new Error('JWT_SECRET environment variable is not set');

  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export class AuthService {
  async register(input: RegisterInput): Promise<{ user: IUser; token: string }> {
    const user = await userRepository.create(input);
    const token = signToken(user);
    return { user, token };
  }

  async login(input: LoginInput): Promise<{ user: IUser; token: string }> {
    const user = await userRepository.findByEmail(input.email, true);

    if (!user) {
      // Use generic message to prevent email enumeration
      throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
    }

    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
    }

    const token = signToken(user);
    return { user, token };
  }
}

export const authService = new AuthService();
