import { Request, Response } from 'express';
import orderService from './order.service';
import { successResponse } from '../utils/successHandler';
import { errorResponse } from '../utils/errorHandler';

class OrderController {
  /**
   * Handle creating a new order
   * @param req - HTTP request
   * @param res - HTTP response
   */
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderData = req.body;
      // Call the service to create the order
      const newOrder = await orderService.createOrder(orderData);
      // Respond with the created order
      res
        .status(201)
        .json(successResponse('Order created successfully', newOrder));
    } catch (error) {
      res
        .status(500)
        .json(
          errorResponse('An error occurred while creating the order', error),
        );
    }
  }
  /**
   * Calculate Revenue from Orders
   * @param req - HTTP request
   * @param res - HTTP response
   */
  async calculateRevenue(req: Request, res: Response): Promise<void> {
    try {
      const data = await orderService.calculateRevenue();
      res
        .status(200)
        .json(successResponse('Revenue calculated successfully', data));
    } catch (error) {
      res
        .status(500)
        .json(
          errorResponse('An error occurred while calculating revenue', error),
        );
    }
  }
}

export default new OrderController();
