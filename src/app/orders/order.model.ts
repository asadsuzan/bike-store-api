// src/models/Order.ts
import mongoose, { Schema } from 'mongoose';
import { IOrder } from './order.interface';

// Order Schema
const OrderSchema: Schema<IOrder> = new Schema(
  {
    items: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    user: { type: Schema.Types.ObjectId, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    totalPrice: { type: Number, required: true },
    transaction: {
      id: String,
      transactionStatus: String,
      bank_status: String,
      sp_code: String,
      sp_message: String,
      method: String,
      date_time: String,
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
