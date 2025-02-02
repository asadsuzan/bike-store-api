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
    const { items } = req.body;

    try {
      // validate request
      if (!items || items.length === 0) {
        res
          .status(400)
          .json(errorResponse('Order must contain at least one item x', null));
        return;
      }
      // Call the service to create the order
      const result = await orderService.createOrder(
        req.user?._id,
        items,
        req.ip!,
      );

      if (!result.success) {
        res.status(400).json(result);
        return;
      }
      // Respond with the created order

      res
        .status(201)
        .json(successResponse('Order created successfully', result));
      return;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'An error occurred while creating the order';
      res.status(500).json(errorResponse(message, error));
    }
  }

  // verify payment
  async verifyPayment(req: ExtendedRequest, res: Response): Promise<void> {
    try {
      const { order_id } = req.query;

      if (!order_id) {
        res.status(400).json(errorResponse('Order id is required', null));
        return;
      }
      const result = await orderService.verifyPayment(order_id as string);
      if (!result.success) {
        res.status(400).json(errorResponse(result.message, null));
        return;
      }
      res.json(successResponse('Payment verified successfully', result));
    } catch (error) {
      // console.log(error);
      const message =
        error instanceof Error
          ? error.message
          : 'An error occurred while verifying payment';
      res.status(500).json(errorResponse(message, error));
    }
  }

  // get all orders
  async getAllOrders(req: ExtendedRequest, res: Response) {
    try {
      const filters = {
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
      };

      const result = await orderService.getAllOrders(
        req.user?._id,
        req.user?.role,
        filters,
      );
      if (!result.success) {
        res.status(400).json(errorResponse(result.message, null));
        return;
      }
      res.json(successResponse('Orders retrieved successfully', result));
    } catch (error) {
      // console.log(error);
      const message =
        error instanceof Error
          ? error.message
          : 'An error occurred while retrieving orders';
      res.status(500).json(errorResponse(message, error));
    }
  }

  // get summary
  async getOderSummary(req: ExtendedRequest, res: Response) {
    try {
      const result = await orderService.getOrderSummary(
        req.user?._id,
        req.user?.role,
      );
      if (!result.success) {
        res.status(400).json(errorResponse(result.message as string, null));
        return;
      }
      res.json(successResponse('Order summary retrieved successfully', result));
    } catch (error) {
      // console.log(error);
      const message =
        error instanceof Error
          ? error.message
          : 'An error occurred while retrieving order summary';
      res.status(500).json(errorResponse(message, error));
    }
  }
}

export default new OrderController();
