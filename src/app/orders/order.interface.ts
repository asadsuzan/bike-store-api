import { Document } from 'mongoose';

// Order Item Interface
export interface IOrderItem {
  productId: string;
  quantity: number;
}

// Order Interface
export interface IOrder extends Document {
  items: IOrderItem[];
  user: string;
  status: string; // e.g., "Pending", "Completed", "Cancelled"
  totalPrice: number; // Total price of the order
}
