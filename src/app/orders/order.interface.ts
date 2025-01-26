// import core modules
import { ObjectId } from 'mongoose';

interface IOrder {
  customer: ObjectId;
  product: ObjectId;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'delivered' | 'cancelled';
}

export default IOrder;
