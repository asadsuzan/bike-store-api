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
  // get revenue
  async getOderRevenue(userId: string, role: string) {
    try {
      const matchCondition =
        role === 'admin'
          ? { status: 'Paid' }
          : { user: userId, status: 'Paid' };

      const revenue = await Order.aggregate([
        { $match: matchCondition },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalPrice' },
            totalExpense: { $sum: '$totalPrice' },
          },
        },
      ]);

      return {
        success: true,
        revenue: revenue[0]?.totalRevenue || 0,
      };
    } catch (error) {
      return {
        success: false,
        message:
          (error as Error).message ||
          'An error occurred while retrieving order revenue.',
      };
    }
  }

  // get sells overview
  async getSalesOverview(userId: string, role: string) {
    try {
      const matchCondition = role === 'admin' ? {} : { user: userId };

      // Aggregate orders to get total sales per month
      const salesData = await Order.aggregate([
        { $match: matchCondition },
        {
          $project: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            totalPrice: 1,
          },
        },
        {
          $group: {
            _id: { year: '$year', month: '$month' },
            totalSales: { $sum: '$totalPrice' },
          },
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 },
        },
      ]);

      // Format the sales data
      const formattedSalesData = salesData.map((entry: any) => ({
        month: new Date(entry._id.year, entry._id.month - 1).toLocaleString(
          'default',
          { month: 'short' },
        ),
        sales: entry.totalSales,
      }));

      // Ensure that all months are included, even if no sales data exists for some months
      const allMonths = [
        { month: 'Jan', sales: 0 },
        { month: 'Feb', sales: 0 },
        { month: 'Mar', sales: 0 },
        { month: 'Apr', sales: 0 },
        { month: 'May', sales: 0 },
        { month: 'Jun', sales: 0 },
        { month: 'Jul', sales: 0 },
        { month: 'Aug', sales: 0 },
        { month: 'Sep', sales: 0 },
        { month: 'Oct', sales: 0 },
        { month: 'Nov', sales: 0 },
        { month: 'Dec', sales: 0 },
      ];

      formattedSalesData.forEach((entry: any) => {
        const monthIndex = allMonths.findIndex(
          (month) => month.month === entry.month,
        );
        if (monthIndex !== -1) {
          allMonths[monthIndex].sales = entry.sales;
        }
      });

      return {
        success: true,
        salesOverview: allMonths,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.message || 'An error occurred while retrieving sales overview.',
      };
    }
  }
  /**
   * Delete an order based on user role
   * @param orderId - ID of the order to delete
   * @param userId - ID of the user attempting to delete the order
   * @param role - Role of the user ("admin" or "user")
   * @returns - Success or error message
   */
  async deleteOrder(orderId: string, userId: string, role: string) {
    try {
      let order;

      if (role === 'admin') {
        // Admin can delete any order
        order = await Order.findByIdAndDelete(orderId);
      } else {
        // Regular user can only delete their own order
        order = await Order.findOneAndDelete({ _id: orderId, user: userId });
      }

      if (!order) {
        return {
          success: false,
          message:
            role === 'admin'
              ? 'Order not found.'
              : 'Order not found or you do not have permission to delete it.',
        };
      }

      return {
        success: true,
        message: 'Order deleted successfully.',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'An error occurred while deleting the order.',
      };
    }
  }

  async getRecentOrders(userId: string, role: string) {
    try {
      // Determine the query condition based on user role
      const queryCondition = role === 'admin' ? {} : { user: userId };

      // Query the database for the 5 most recent orders
      const recentOrders = await Order.find(queryCondition)
        .sort({ createdAt: -1 })
        .limit(3)
        .populate({
          path: 'items.productId',
          model: 'Bike',
        })
        .populate({
          path: 'user',
          model: 'User',
        });

      return {
        success: true,
        orders: recentOrders,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'An error occurred while retrieving orders.',
      };
    }
  }

    /**
   * Update the status of an order
   * @param orderId - ID of the order to update
   * @param newStatus - New status to set
   * @returns - Success or error response
   */
    async updateOrderStatus(orderId: string, newStatus: string) {
      try {
        // Validate the new status
        const validStatuses = ['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'];
        if (!validStatuses.includes(newStatus)) {
          return {
            success: false,
            message: 'Invalid status provided.',
          };
        }
  
        // Fetch the existing order
        const order = await Order.findById(orderId);
        if (!order) {
          return {
            success: false,
            message: 'Order not found.',
          };
        }
  
        const currentStatus = order.status;
  
        // Define valid status transitions
        const statusTransitions: { [key: string]: string[] } = {
          Pending: ['Cancelled', 'Paid'],
          Paid: ['Shipped'],
          Shipped: ['Completed'],
          Completed: [],
          Cancelled: [],
        };
  
        // Check if the new status is a valid transition
        if (!statusTransitions[currentStatus]?.includes(newStatus)) {
          return {
            success: false,
            message: `Cannot transition from ${currentStatus} to ${newStatus}.`,
          };
        }
  
        // Update the order status
        order.status = newStatus as 'Pending' | 'Paid' | 'Shipped' | 'Completed' | 'Cancelled';
        await order.save();
  
        return {
          success: true,
          message: `Order status updated to ${newStatus}.`,
          order,
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || 'An error occurred while updating the order status.',
        };
      }
    }
}

export default new OrderService();
