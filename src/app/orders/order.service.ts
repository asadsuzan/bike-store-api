/* eslint-disable @typescript-eslint/no-explicit-any */

import BikeService from '../bike/bike.service';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import User from '../user/user.model';
import { orderUtils } from './order.utils';

class OrderService {
  /**
   * Create a new order
   * @param userId - ID of the user placing the order
   * @param items - Array of order items
   * @returns - Created order document or error message
   */
  async createOrder(
    userId: string,
    items: { productId: string; quantity: number }[],
    client_ip: string,
  ) {
    try {
      const updatedItems = [];
      let totalPrice = 0;

      for (const item of items) {
        // Get the product details
        const bike = await BikeService.getSpecificBike(item.productId);

        if (!bike) {
          return {
            message: `Product with ID ${item.productId} not found`,
            success: false,
            status: 'NOT-Found',
            item: item.productId,
          };
        }

        // Check stock availability
        if (!bike.inStock) {
          return {
            message: `Product with ID ${item.productId} is out of stock`,
            success: false,
            status: 'STOCK-OUT',
            item: item.productId,
            availableQuantity: bike.quantity,
          };
        }

        if (bike.quantity < item.quantity) {
          return {
            message: `Quantity for product ID ${item.productId} not available`,
            success: false,
            status: 'INSUFFICIENT-QUANTITY',
            item: item.productId,
            availableQuantity: bike.quantity,
          };
        }

        // Calculate total price and update stock
        totalPrice += bike.price * item.quantity;
        bike.quantity -= item.quantity;
        await bike.save();

        updatedItems.push(item);
      }
      // Create the order
      const orderData = {
        user: userId,
        items: updatedItems,
        status: 'Pending',
        totalPrice,
      } as unknown as IOrder;

      let order = await Order.create(orderData);
      const user = await User.findById(userId);
      // payment integration
      if (!user) {
        return {
          message: 'User not found',
          success: false,
        };
      }

      const shurjopayPayload = {
        amount: totalPrice,
        order_id: order._id,
        currency: 'BDT',
        customer_name: user.name,
        customer_address: user.address,
        customer_email: user.email,
        customer_phone: user.phone,
        customer_city: user.city,
        client_ip,
      };

      const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

      if (payment?.transactionStatus) {
        order = await order.updateOne({
          transaction: {
            id: payment.sp_order_id,
            transactionStatus: payment.transactionStatus,
          },
        });
      }
      return {
        success: true,
        checkout_url: payment.checkout_url,
      };
    } catch (e: any) {
      return {
        message: e.message || 'An error occurred while creating the order',
        success: false,
      };
    }
  }

  async verifyPayment(order_id: string) {
    const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

    try {
      if (verifiedPayment.length) {
        await Order.findOneAndUpdate(
          {
            'transaction.id': order_id,
          },
          {
            'transaction.bank_status': verifiedPayment[0].bank_status,
            'transaction.sp_code': verifiedPayment[0].sp_code,
            'transaction.sp_message': verifiedPayment[0].sp_message,
            'transaction.transactionStatus':
              verifiedPayment[0].transaction_status,
            'transaction.method': verifiedPayment[0].method,
            'transaction.date_time': verifiedPayment[0].date_time,
            status:
              verifiedPayment[0].bank_status == 'Success'
                ? 'Paid'
                : verifiedPayment[0].bank_status == 'Failed'
                  ? 'Pending'
                  : verifiedPayment[0].bank_status == 'Cancel'
                    ? 'Cancelled'
                    : '',
          },
        );
      }

      return { success: true, verifiedPayment };
    } catch (err: any) {
      return {
        message: err.message || 'An error occurred while verifying the payment',
        success: false,
      };
    }
  }

  // get all orders
  async getAllOrders(userId: string, role: string, filters: any) {
    try {
      let query =
        role === 'admin' ? Order.find() : Order.find({ user: userId });

      // Apply case-insensitive filtering for status
      if (filters.status) {
        query = query.where('status').regex(new RegExp(filters.status, 'i'));
      }
      if (filters.startDate && filters.endDate) {
        query = query
          .where('createdAt')
          .gte(new Date(filters.startDate).getTime())
          .lte(new Date(filters.endDate).getTime());
      }

      if (filters.minPrice && filters.maxPrice) {
        query = query
          .where('totalPrice')
          .gte(filters.minPrice)
          .lte(filters.maxPrice);
      }

      query = query.sort({ createdAt: -1 });

      const orders = await query
        .populate({
          path: 'items.productId', // Proper way to target productId in nested array
          model: 'Bike',
        })
        .exec();

      return {
        success: true,
        orders,
      };
    } catch (err: any) {
      return {
        message: err.message || 'An error occurred while getting orders',
        success: false,
      };
    }
  }
  // get summary
  async getOrderSummary(userId: string, role: string) {
    try {
      const matchCondition = role === 'admin' ? {} : { user: userId };

      const summary = await Order.aggregate([
        { $match: matchCondition },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
        {
          $facet: {
            statusCounts: [
              {
                $group: {
                  _id: '$_id',
                  count: { $sum: '$count' },
                },
              },
            ],
            totalOrders: [
              {
                $group: {
                  _id: null,
                  total: { $sum: '$count' },
                },
              },
            ],
          },
        },
      ]);

      const statusCounts = summary[0]?.statusCounts || [];
      const totalOrders = summary[0]?.totalOrders[0]?.total || 0;

      return {
        success: true,
        summary: {
          allOrders: totalOrders,
          pending:
            statusCounts.find((item: { _id: string }) => item._id === 'Pending')
              ?.count || 0,
          paid:
            statusCounts.find((item: { _id: string }) => item._id === 'Paid')
              ?.count || 0,
          shipped:
            statusCounts.find((item: { _id: string }) => item._id === 'Shipped')
              ?.count || 0,
          completed:
            statusCounts.find(
              (item: { _id: string }) => item._id === 'Completed',
            )?.count || 0,
          cancelled:
            statusCounts.find(
              (item: { _id: string }) => item._id === 'Cancelled',
            )?.count || 0,
        },
      };
    } catch (error) {
      return {
        success: false,
        message:
          (error as Error).message ||
          'An error occurred while retrieving order summary.',
      };
    }
  }
}

export default new OrderService();
