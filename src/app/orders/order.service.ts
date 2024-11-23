import BikeService from '../bike/bike.service';
import IOrder from './order.interface';
import OrderModel, { IOrderDocument } from './order.model';

class OrderService {
  /**
   * Create a new order
   * @param orderData - Data for the new order
   * @returns - Created order document
   */
  async createOrder(orderData: IOrder): Promise<IOrderDocument> {
    const { product, quantity } = orderData;
    const productId = String(product);
    // check if the request for the product is exits on bikes document
    const bike = await BikeService.getSpecificBike(productId);
    if (!bike) {
      throw new Error('Product not found');
    }
    // check if the requested quantity is available in the bike
    if (bike.quantity < quantity || bike.inStock === false) {
      throw new Error('Not enough quantity available');
    }

    // reduce the quantity of the bike
    bike.quantity -= quantity;
    // If the  quantity goes to zero, set inStock to false.
    if (bike.quantity === 0) {
      bike.inStock = false;
    }
    await BikeService.updateABike(productId, bike);

    // calculate the total price
    const totalPrice = bike.price * quantity;
    orderData.totalPrice = totalPrice;

    // create a new order
    const newOrder = new OrderModel(orderData);
    return await newOrder.save();
  }
  /**
   * Calculate Revenue
   * @returns - The total revenue from all orders.
   */

  async calculateRevenue() {
    const orders = await OrderModel.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);
    const data = { totalRevenue: 0 };
    if (orders.length > 0) {
      data.totalRevenue = orders[0].totalRevenue;
    }

    return data;
  }
}

export default new OrderService();
