// import core modules
import express from 'express';
const router = express.Router();
// import user controller modules
import UserController from './user.controller';
import auth from '../middleware/auth';
import { UserRoles } from './user.constants';

/**
 * create a new user
 * @endpoint  /api/user/register
 * @method: POST
 */

router.post('/register', UserController.registerNewUser);
/**
 * login user
 * @endpoint  /api/user/login
 * @method: POST
 */
router.post('/login', UserController.loginUser);
router.post('/register', UserController.registerNewUser);
/**
 *  user count
 * @endpoint  /api/user/count
 * @method: GET
 */
router.get('/count', auth(UserRoles.admin), UserController.getCustomerCount);
// Update user profile by admin or user
router.put('/profile', auth(UserRoles.customer, UserRoles.admin), UserController.updateUserProfile);
// Update user profile by admin or user
router.get('/profile', auth(UserRoles.customer, UserRoles.admin), UserController.getProfile);
export default router;
