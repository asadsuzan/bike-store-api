// import Bike interface modules

import { IBike, BikeCategory, BikeBrand } from './bike.interface';

// import core modules
import mongoose, { Schema, Document, Model, UpdateQuery } from 'mongoose';
// Mongoose Document extending the IBike interface
export interface IBikeDocument extends IBike, Document {}

// Define the Bike schema
const BikeSchema: Schema<IBikeDocument> = new Schema<IBikeDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      enum: Object.values(BikeBrand),
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
      default: false,
    },
    image: {
      type: String,
      trim: true,
      default: function () {
        return `https://placehold.co/600x400?text=${this.name}`;
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { timestamps: true, versionKey: false },
);

// HOOK FOR EXCLUDE DELETED BIKE WHEN FIND
BikeSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
BikeSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Pre-save hook to update the `inStock` property based on the `quantity`
BikeSchema.pre('save', function (next) {
  const bike = this as IBikeDocument;

  // Set `inStock` based on the `quantity`
  bike.inStock = bike.quantity > 0;

  next();
});

// Pre-update hook to update the `inStock` property based on the `quantity`
BikeSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as UpdateQuery<IBikeDocument>;

  if (update.quantity !== undefined) {
    // Set `inStock` based on the `quantity`
    update.inStock = update.quantity > 0;
  }

  next();
});

// Create the bike model
const BikeModel: Model<IBikeDocument> = mongoose.model<IBikeDocument>(
  'Bike',
  BikeSchema,
);

export default BikeModel;
