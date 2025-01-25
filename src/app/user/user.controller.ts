// import bike service module

// import generic error handler
import { errorResponse } from '../utils/errorHandler';
// import generic success handler
import { successResponse } from '../utils/successHandler';
// import core modules
import { Request, Response } from 'express';

import userService from './user.service';

class UserController {
  /**
   * crate a new user
   * @param req - express request object
   * @param res - express response object
   */

  async registerNewUser(req: Request, res: Response): Promise<void> {
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
      res
        .status(201)
        .json(successResponse('User Registered successfully', user));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An error occurred';
      res.status(500).json(errorResponse(message, error));
    }
  }
}

export default new UserController();
