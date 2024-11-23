"use strict";
// import bike order modules
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
const order_model_1 = __importDefault(require("./order.model"));
class OrderService {
    /**
     * Create a new order
     * @param orderData - Data to create a order
     * @returns Created order document
     */
    OrderBike(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderDoc = new order_model_1.default(orderData);
            return yield orderDoc.save();
        });
    }
}
exports.default = OrderService;
