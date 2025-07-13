import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import config from '../config';

// Define a type for the user object without the password
type UserWithoutPassword = Omit<IUser, 'password' | 'comparePassword'>;

export class AuthService {
  async register(data: Partial<IUser>): Promise<{ user: UserWithoutPassword; token: string }> {
    const user = new User(data);
    await user.save();
    const token = jwt.sign({ id: user._id }, config.jwt_secret, { expiresIn: '1h' });

    // Fetch the user again to ensure password is not included due to select: false
    const userWithoutPassword = await User.findById(user._id).select('-password').lean();

    if (!userWithoutPassword) {
      throw new Error('User not found after registration');
    }

    return { user: userWithoutPassword as UserWithoutPassword, token };
  }

  async login(data: Partial<IUser>): Promise<{ user: UserWithoutPassword; token: string } | null> {
    // Explicitly select password for comparison
    const user = await User.findOne({ email: data.email }).select('+password');
    if (!user || !(await user.comparePassword(data.password!))) {
      return null;
    }
    const token = jwt.sign({ id: user._id }, config.jwt_secret, { expiresIn: '1h' });

    // Fetch the user again without password for response
    const userWithoutPassword = await User.findById(user._id).select('-password').lean();

    if (!userWithoutPassword) {
      throw new Error('User not found after login');
    }

    return { user: userWithoutPassword as UserWithoutPassword, token };
  }
}