import BikeService from '../bike/bike.service';

import IOrder from './order.interface';
import OrderModel from './order.model';

class OrderService {
  /**
   * Create a new order
   * @param orderData - Data for the new order
   * @returns - Created order document
   */
  async createOrder(orderData: IOrder) {
    try {
      // get the bike
      const bike = await BikeService.getSpecificBike(
        orderData.product as unknown as string,
      );
      if (!bike) {
        return {
          message: 'Product not found',
          success: false,
        };
      }
      // check if the bike is in stock
      if (!bike.inStock) {
        return {
          message: 'Product out of stock',
          success: false,
        };
      }
      // check if the quantity is available
      if (bike.quantity < orderData.quantity) {
        return {
          message: 'Quantity not available',
          success: false,
        };
      }
      // calculate the total price
      orderData.totalPrice = bike.price * orderData.quantity;
      // create the order
      const order = await OrderModel.create(orderData);
      // update the bike quantity
      bike.quantity -= orderData.quantity;
      await bike.save();

      return {
        message: 'Order created successfully',
        success: true,
        data: order,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return {
        message: 'An error occurred',
        success: false,
      };
    }
  }
}

export default new OrderService();
