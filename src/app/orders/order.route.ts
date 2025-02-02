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

router.post('/', auth(UserRoles.customer), orderController.createOrder);

/**
 * verify payment
 * @endpoint  /api/orders?order_id=1231424252
 * @method: GET
 */
router.get(
  '/verify-payment',
  auth(UserRoles.customer),
  orderController.verifyPayment,
);
/**
 * get orders
 * @endpoint  /api/order/orders
 * @method: GET
 */
router.get(
  '/orders',
  auth(UserRoles.customer, UserRoles.admin),
  orderController.getAllOrders,
);
/**
 * get orders summary
 * @endpoint  /api/order/get-summary
 * @method: GET
 */
router.get(
  '/summary',
  auth(UserRoles.customer, UserRoles.admin),
  orderController.getOderSummary,
);
/**
 * delete oder
 * @endpoint  /api/order/:orderId
 * @method: GET
 */
router.delete(
  '/:orderId',
  auth(UserRoles.customer, UserRoles.admin),
  orderController.deleteOrder,
);

export default router;
