// import bike service module

// import generic error handler
import { errorResponse } from '../utils/errorHandler';
// import generic success handler
import { successResponse } from '../utils/successHandler';
// import core modules
import { Request, Response } from 'express';

import userService from './user.service';
import config from '../../config';

class UserController {
  /**
   * crate a new user
   * @param req - express request object
   * @param res - express response object
   */

  async registerNewUser(req: Request, res: Response): Promise<void> {
    // validate user input
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      res
        .status(400)
        .json(
          errorResponse(
            'Email, password and name are required',
            'Invalid inputs',
          ),
        );
      return;
    }
    try {
      const user = await userService.registerNewUser(req.body);
      if (!user) {
        res
          .status(400)
          .json(
            errorResponse(
              'Failed to create user, Please check your input',
              'Invalid inputs',
            ),
          );
        return;
      }

      // remove the password from the user object

      res
        .status(201)
        .json(successResponse('User Registered successfully', user));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An error occurred';
      res.status(500).json(errorResponse(message, error));
    }
  }

  /**
   * login user
   * @param req - express request object
   * @param res - express response object
   */
  async loginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(400)
        .json(
          errorResponse('Email and password are required', 'Invalid inputs'),
        );
      return;
    }
    try {
      const user = await userService.loginUser(email, password);
      if (!user) {
        res
          .status(400)
          .json(
            errorResponse(
              'Failed to login user, Please check your input',
              'Invalid inputs',
            ),
          );
        return;
      }
      res.cookie('refreshToken', user.refreshToken, {
        secure: config.node_env === 'production',

        httpOnly: true,
      });
      res
        .status(200)
        .json(successResponse('User Logged in successfully', user));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An error occurred';
      res.status(500).json(errorResponse(message, error));
    }
  }
}

export default new UserController();
