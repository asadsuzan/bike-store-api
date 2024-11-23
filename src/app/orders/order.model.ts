// import core modules 
// import core modules
import mongoose, { Schema, Document, Model } from 'mongoose';

import IOrder from "./order.interface";

export interface IOrderDocument extends IOrder, Document { }

const OrderSchema: Schema<IOrderDocument> = new Schema<IOrderDocument>({
    email: { type: String, required: [true, "email is required"] },
    product: { type: String, required: [true, "product is required"] },
    quantity: { type: Number, required: [true, "Quantity is required"] },
    totalPrice: { type: Number, required: [true, 'Total price is required'] }
}, { timestamps: true },)


// crate the order model
const OrderModel: Model<IOrderDocument> = mongoose.model<IOrderDocument>("orders", OrderSchema)

export default OrderModel