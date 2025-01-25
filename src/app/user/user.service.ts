// import user model modules

import { TUser } from './user.interface';
import User from './user.model';
import bcrypt from 'bcrypt';

class UserService {
  /**
   * Create a new USER
   * @param userData - Data to create a user
   * @returns Created user document
   */

  async registerNewUser(userData: TUser) {
    const { email, password } = userData;

    // check if the email is already in use
    const isExistingEmail = await User.findOne({
      email,
    });

    if (isExistingEmail?._id) {
      throw new Error('Email already in use');
    }
    // hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      ...userData,
      password: hashedPassword,
    });
    // Save the user and exclude the password field from the response
    const savedUser = await user.save();
    const userWithoutPassword = savedUser.toObject({
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    });

    return userWithoutPassword;
  }
}

export default new UserService();
