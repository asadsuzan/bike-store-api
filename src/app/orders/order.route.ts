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

/**
 * verify payment
 * @endpoint  /api/orders?order_id=1231424252
 * @method: GET
 */
router.get('/orders', auth(UserRoles.customer), orderController.verifyPayment);

export default router;
