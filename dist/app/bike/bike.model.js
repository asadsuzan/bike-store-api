"use strict";
// import Bike interface modules
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bike_interface_1 = require("./bike.interface");
// import core modules
const mongoose_1 = __importStar(require("mongoose"));
// Define the Bike schema
const BikeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    brand: {
        type: String,
        required: true,
        enum: Object.values(bike_interface_1.BikeBrand),
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
        enum: Object.values(bike_interface_1.BikeCategory),
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
}, { timestamps: true, versionKey: false });
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
    const bike = this;
    // Set `inStock` based on the `quantity`
    bike.inStock = bike.quantity > 0;
    next();
});
// Pre-update hook to update the `inStock` property based on the `quantity`
BikeSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update.quantity !== undefined) {
        // Set `inStock` based on the `quantity`
        update.inStock = update.quantity > 0;
    }
    next();
});
// Create the bike model
const BikeModel = mongoose_1.default.model('Bike', BikeSchema);
exports.default = BikeModel;
