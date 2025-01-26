//import core modules
import express from 'express';
import orderController from './order.controller';
import auth from '../middleware/auth';
import { UserRoles } from '../user/user.constants';

const router = express.Router();

/**
 * create a new order
 * @endpoint  /api/orders
 * @method: POST
 */

router.post('/orders', auth(UserRoles.customer), orderController.createOrder);

export default router;
