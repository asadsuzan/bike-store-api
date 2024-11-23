// import bike order modules

import OrderModel, { IOrderDocument } from './order.model';

class OrderService {
  /**
   * Create a new order
   * @param orderData - Data to create a order
   * @returns Created order document
   */
  async OrderBike(orderData: IOrderDocument): Promise<IOrderDocument | null> {
    const orderDoc = new OrderModel(orderData);
    return await orderDoc.save();
  }
}

export default OrderService;
