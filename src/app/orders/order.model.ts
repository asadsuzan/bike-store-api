// src/models/Order.ts
import mongoose, { Schema } from 'mongoose';
import { IOrder } from './order.interface';

// Order Schema
const OrderSchema: Schema = new Schema(
  {
    items: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    user: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
