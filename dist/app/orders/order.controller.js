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
const order_service_1 = __importDefault(require("./order.service"));
const successHandler_1 = require("../utils/successHandler");
const errorHandler_1 = require("../utils/errorHandler");
class OrderController {
    /**
     * Handle creating a new order
     * @param req - HTTP request
     * @param res - HTTP response
     */
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderData = req.body;
                // Call the service to create the order
                const newOrder = yield order_service_1.default.createOrder(orderData);
                // Respond with the created order
                res.status(201).json((0, successHandler_1.successResponse)('Order created successfully', newOrder));
            }
            catch (error) {
                res.status(500).json((0, errorHandler_1.errorResponse)('An error occurred while creating the order', error));
            }
        });
    }
    /**
 * Calculate Revenue from Orders
 * @param req - HTTP request
 * @param res - HTTP response
 */
    calculateRevenue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield order_service_1.default.calculateRevenue();
                res.status(200).json((0, successHandler_1.successResponse)('Revenue calculated successfully', data));
            }
            catch (error) {
                res.status(500).json((0, errorHandler_1.errorResponse)('An error occurred while calculating revenue', error));
            }
        });
    }
}
exports.default = new OrderController();
