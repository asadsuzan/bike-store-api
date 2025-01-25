// import core modules
import express from 'express';
const router = express.Router();
// import user controller modules
import UserController from './user.controller';

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
export default router;
