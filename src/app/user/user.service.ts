// import user model modules

import config from '../../config';
import { createToken } from '../utils/createToken';
import { TUser } from './user.interface';
import User from './user.model';
import bcrypt from 'bcrypt';

class UserService {
  /**
   * Create a new USER
   * @param userData - Data to create a user
   * @returns Created user document
   */

  async   registerNewUser(userData: TUser) {
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

  /**
   * login a user
   * @param email - Email of the user
   * @param password - Password of the user
   * @returns User document
   */
  async loginUser(email: string, password: string) {
    // check if the user exists
    const user = await User.findOne({
      email,
    }).select('+password');
    if (!user) {
      throw new Error('Invalid email or password');
    }
    // compare the password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }
    // crate a token
    const accessToken = createToken(
      {
        userId: user._id as unknown as string,
        role: user.role,
      },
      config.jwt_secret as string,
      '10D',
    );

    // create a refresh token
    const refreshToken = createToken(
      {
        userId: user._id as unknown as string,
        role: user.role,
      },
      config.jwt_secret as string,
      '30D',
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  // get the total customer count
  async getTotalCustomerCount() {
    const count = await User.countDocuments({ role: 'customer' });
    return {
      totalCustomers: count,
    };
  }

    /**
   * Update user profile by User or Admin
   * @param userId - User ID
   * @param updateData - Profile update data
   * @param isAdmin - Boolean flag to differentiate admin update
   * @returns Updated user profile
   */
    async updateUserProfile(userId: string, updateData: Partial<TUser>, isAdmin: boolean) {
      const updateFields: Partial<TUser> = { ...updateData };
  // console.log(userId)

      // Prevent unauthorized users from changing roles
      if (!isAdmin && updateFields.role) delete updateFields.role;
  if(updateFields.password) delete updateFields.password
  if(updateFields.email) delete updateFields.email
     
  
      const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select('-password -role');
  
      if (!updatedUser) throw new Error('User not found');

      return updatedUser;
    }
    /**
   get profiles
   */
    async getProfile(userId: string) {
    
      const profile = await User.findById(userId ).select('-password');
  
      if (!profile) throw new Error('User not found');
  
      return profile;
    }
}

export default new UserService();
