// import user model modules

import { TUser } from './user.interface';
import User from './user.model';

class UserService {
  /**
   * Create a new USER
   * @param userData - Data to create a user
   * @returns Created user document
   */

  async registerNewUser(userData: TUser): Promise<TUser | null> {
    const { email } = userData;

    // check if the email is already in use
    const isExistingEmail = await User.findOne({
      email,
    });

    if (isExistingEmail?._id) {
      throw new Error('Email already in use');
    }

    const user = new User(userData);
    return await user.save();
  }
}

export default new UserService();
