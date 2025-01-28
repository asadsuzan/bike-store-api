import { Document, Types } from 'mongoose';

// Order Item Interface
export interface IOrderItem {
  productId: Types.ObjectId;
  quantity: number;
}

// Order Interface
export interface IOrder extends Document {
  items: IOrderItem[];
  user: Types.ObjectId;
  status: 'Pending' | 'Paid' | 'Shipped' | 'Completed' | 'Cancelled';
  totalPrice: number; // Total price of the order
  transaction: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
}
