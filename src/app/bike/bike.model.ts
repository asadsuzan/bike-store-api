// import Bike interface modules

import { IBike, BikeCategory } from './bike.interface';

// import core modules
import mongoose, { Schema, Document, Model } from 'mongoose';
// Mongoose Document extending the IBike interface
export interface IBikeDocument extends IBike, Document {}

// Define the Bike schema
const BikeSchema: Schema<IBikeDocument> = new Schema<IBikeDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: Object.values(BikeCategory),
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  inStock: {
    type: Boolean,
    required: true,
  },
});

// Create the bike model
const BikeModel: Model<IBikeDocument> = mongoose.model<IBikeDocument>(
  'Bike',
  BikeSchema,
);

export default BikeModel;
