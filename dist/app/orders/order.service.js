"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bike_service_1 = __importDefault(require("../bike/bike.service"));
const order_model_1 = __importDefault(require("./order.model"));
class OrderService {
    /**
     * Create a new order
     * @param orderData - Data for the new order
     * @returns - Created order document
     */
    createOrder(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { product, quantity } = orderData;
            const productId = String(product);
            // check if the request for the product is exits on bikes document
            const bike = yield bike_service_1.default.getSpecificBike(productId);
            if (!bike) {
                throw new Error('Product not found');
            }
            // check if the requested quantity is available in the bike
            if (bike.quantity < quantity || bike.inStock === false) {
                throw new Error('Not enough quantity available');
            }
            // reduce the quantity of the bike
            bike.quantity -= quantity;
            // If the  quantity goes to zero, set inStock to false.
            if (bike.quantity === 0) {
                bike.inStock = false;
            }
            yield bike_service_1.default.updateABike(productId, bike);
            // calculate the total price
            const totalPrice = bike.price * quantity;
            orderData.totalPrice = totalPrice;
            // create a new order
            const newOrder = new order_model_1.default(orderData);
            return yield newOrder.save();
        });
    }
    /**
     * Calculate Revenue
     * @returns - The total revenue from all orders.
     */
    calculateRevenue() {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield order_model_1.default.aggregate([
                { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
            ]);
            const data = { totalRevenue: 0 };
            if (orders.length > 0) {
                data.totalRevenue = orders[0].totalRevenue;
            }
            return data;
        });
    }
}
exports.default = new OrderService();
