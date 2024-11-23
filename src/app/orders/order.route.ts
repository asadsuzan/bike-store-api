//import core modules
import express from "express";
import orderController from "./order.controller";

const router = express.Router();

/**
 * create a new order
 * @endpoint  /api/orders
 * @method: POST
 */

router.post('/orders', orderController.createOrder);

export default router;
