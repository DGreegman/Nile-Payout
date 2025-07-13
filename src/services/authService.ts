import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import config from '../config';

export class AuthService {
  async register(data: Partial<IUser>): Promise<{ user: IUser; token: string }> {
    const user = new User(data);
    await user.save();
    const token = jwt.sign({ id: user._id }, config.jwt_secret, { expiresIn: '1h' });
    return { user, token };
  }

  async login(data: Partial<IUser>): Promise<{ user: IUser; token: string } | null> {
    const user = await User.findOne({ email: data.email });
    if (!user || !(await user.comparePassword(data.password!))) {
      return null;
    }
    const token = jwt.sign({ id: user._id }, config.jwt_secret, { expiresIn: '1h' });
    return { user, token };
  }
}