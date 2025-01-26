import { Request, Response } from 'express';
import orderService from './order.service';
import { successResponse } from '../utils/successHandler';
import { errorResponse } from '../utils/errorHandler';
import { JwtPayload } from 'jsonwebtoken';
interface ExtendedRequest extends Request {
  user?: JwtPayload; // Make the user property optional
}

class OrderController {
  /**
   * Handle creating a new order
   * @param req - HTTP request
   * @param res - HTTP response
   */
  async createOrder(req: ExtendedRequest, res: Response): Promise<void> {
    const { product, quantity, totalPrice } = req.body;

    try {
      // validate request

      if (!product) {
        res.status(400).json({
          success: false,
          message: 'Product Id is required',
        });
        return;
      }
      if (!quantity) {
        res.status(400).json({
          success: false,
          message: 'Quantity is required',
        });
        return;
      }
      if (!totalPrice) {
        res.status(400).json({
          success: false,
          message: 'Total price is required',
        });
        return;
      }

      // Call the service to create the order
      const newOrder = await orderService.createOrder({
        product,
        quantity,
        totalPrice,
        customer: req?.user?.userId,
        status: 'pending', // Add the status property
      });
      if (!newOrder.success) {
        res.status(400).json(errorResponse(newOrder.message, null));
        return;
      }
      // Respond with the created order

      res
        .status(201)
        .json(successResponse('Order created successfully', newOrder));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'An error occurred while creating the order';
      res.status(500).json(errorResponse(message, error));
    }
  }
}

export default new OrderController();
