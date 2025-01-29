import { Request, NextFunction, Response } from 'express';

import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import User from '../user/user.model';

export interface TRole {
  admin: 'admin';
  customer: 'customer';
}
interface ExtendedRequest extends Request {
  user?: (JwtPayload & { role: string }) | null; // Make the user property optional and include role
}
type TUserRole = keyof TRole;
const auth = (...accessibleRoles: TUserRole[]) => {
  return async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      // get the token
      const token = req.header('Authorization');

      // check if the token exists
      if (!token) {
        // throw new Error('Unauthorized: Token is required');
        res
          .status(401)
          .send({ success: false, message: 'Unauthorized: Token is required' });
        return;
      }

      // check if the token is valid
      let decoded;

      try {
        decoded = jwt.verify(token, config.jwt_secret as string);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        res
          .status(401)
          .send({ success: false, message: 'Unauthorized: Invalid token' });
        return;
      }
      const user = await User.findOne({
        _id: (decoded as JwtPayload).userId,
      });
      // attach the user  to the request object
      req.user = user;

      // check if the user has the required role

      if (!req.user || !accessibleRoles.includes(req.user.role as TUserRole)) {
        res
          .status(401)
          .send({ success: false, message: 'Unauthorized: Access Denied' });
        return;
      }

      next();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      res.status(500).send({ success: false, message: 'An error occurred' });
    }
  };
};

export default auth;
