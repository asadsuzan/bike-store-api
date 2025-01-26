// import core modules

import mongoose, { Schema } from 'mongoose';

import IOrder from './order.interface';

const OrderSchema = new Schema<IOrder>(
  {
    customer: { type: String, required: [true, 'email is required'] },
    product: { type: String, required: [true, 'product is required'] },
    quantity: { type: Number, required: [true, 'Quantity is required'] },
    totalPrice: { type: Number, required: [true, 'Total price is required'] },
    status: {
      type: String,
      enum: ['pending', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

// crate the order model
const OrderModel = mongoose.model<IOrder>('orders', OrderSchema);

export default OrderModel;
