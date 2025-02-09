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
            var _a;
            const { items } = req.body;
            try {
                // validate request
                if (!items || items.length === 0) {
                    res
                        .status(400)
                        .json((0, errorHandler_1.errorResponse)('Order must contain at least one item x', null));
                    return;
                }
                // Call the service to create the order
                const result = yield order_service_1.default.createOrder((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, items, req.ip);
                if (!result.success) {
                    res.status(400).json(result);
                    return;
                }
                // Respond with the created order
                res
                    .status(201)
                    .json((0, successHandler_1.successResponse)('Order created successfully', result));
                return;
            }
            catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : 'An error occurred while creating the order';
                res.status(500).json((0, errorHandler_1.errorResponse)(message, error));
            }
        });
    }
    // verify payment
    verifyPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { order_id } = req.query;
                if (!order_id) {
                    res.status(400).json((0, errorHandler_1.errorResponse)('Order id is required', null));
                    return;
                }
                const result = yield order_service_1.default.verifyPayment(order_id);
                if (!result.success) {
                    res.status(400).json((0, errorHandler_1.errorResponse)(result.message, null));
                    return;
                }
                res.json((0, successHandler_1.successResponse)('Payment verified successfully', result));
            }
            catch (error) {
                // console.log(error);
                const message = error instanceof Error
                    ? error.message
                    : 'An error occurred while verifying payment';
                res.status(500).json((0, errorHandler_1.errorResponse)(message, error));
            }
        });
    }
    // get all orders
    getAllOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const filters = {
                    status: req.query.status,
                    startDate: req.query.startDate,
                    endDate: req.query.endDate,
                    minPrice: req.query.minPrice,
                    maxPrice: req.query.maxPrice,
                };
                const result = yield order_service_1.default.getAllOrders((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, (_b = req.user) === null || _b === void 0 ? void 0 : _b.role, filters);
                if (!result.success) {
                    res.status(400).json((0, errorHandler_1.errorResponse)(result.message, null));
                    return;
                }
                res.json((0, successHandler_1.successResponse)('Orders retrieved successfully', result));
            }
            catch (error) {
                // console.log(error);
                const message = error instanceof Error
                    ? error.message
                    : 'An error occurred while retrieving orders';
                res.status(500).json((0, errorHandler_1.errorResponse)(message, error));
            }
        });
    }
    // get summary
    getOderSummary(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const result = yield order_service_1.default.getOrderSummary((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, (_b = req.user) === null || _b === void 0 ? void 0 : _b.role);
                if (!result.success) {
                    res.status(400).json((0, errorHandler_1.errorResponse)(result.message, null));
                    return;
                }
                res.json((0, successHandler_1.successResponse)('Order summary retrieved successfully', result));
            }
            catch (error) {
                // console.log(error);
                const message = error instanceof Error
                    ? error.message
                    : 'An error occurred while retrieving order summary';
                res.status(500).json((0, errorHandler_1.errorResponse)(message, error));
            }
        });
    }
    // delete oder
    deleteOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { orderId } = req.params;
                if (!orderId) {
                    res.status(400).json((0, errorHandler_1.errorResponse)('Order id is required', null));
                    return;
                }
                const result = yield order_service_1.default.deleteOrder(orderId, (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, (_b = req.user) === null || _b === void 0 ? void 0 : _b.role);
                if (!result.success) {
                    res.status(400).json((0, errorHandler_1.errorResponse)(result.message, null));
                    return;
                }
                res.json((0, successHandler_1.successResponse)('Order deleted successfully', result));
            }
            catch (error) {
                // console.log(error);
                const message = error instanceof Error
                    ? error.message
                    : 'An error occurred while deleting the order';
                res.status(500).json((0, errorHandler_1.errorResponse)(message, error));
            }
        });
    }
    // get order revenue
    getOrderRevenue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const result = yield order_service_1.default.getOderRevenue((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, (_b = req.user) === null || _b === void 0 ? void 0 : _b.role);
                if (!result.success) {
                    res.status(400).json((0, errorHandler_1.errorResponse)(result.message, null));
                    return;
                }
                res.json((0, successHandler_1.successResponse)('Order revenue retrieved successfully', result));
            }
            catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : 'An error occurred while retrieving order revenue';
                res.status(500).json((0, errorHandler_1.errorResponse)(message, error));
            }
        });
    }
    // get sells overview
    getSellsOverview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const result = yield order_service_1.default.getSalesOverview((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, (_b = req.user) === null || _b === void 0 ? void 0 : _b.role);
                if (!result.success) {
                    res.status(400).json((0, errorHandler_1.errorResponse)(result.message, null));
                    return;
                }
                res.json((0, successHandler_1.successResponse)('Sells overview retrieved successfully', result));
            }
            catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : 'An error occurred while retrieving sells overview';
                res.status(500).json((0, errorHandler_1.errorResponse)(message, error));
            }
        });
    }
    // recent orders
    getRecentOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const result = yield order_service_1.default.getRecentOrders((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, (_b = req.user) === null || _b === void 0 ? void 0 : _b.role);
                if (!result.success) {
                    res.status(400).json((0, errorHandler_1.errorResponse)(result.message, null));
                    return;
                }
                res.json((0, successHandler_1.successResponse)('Recent orders retrieved successfully', result));
            }
            catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : 'An error occurred while retrieving recent orders';
                res.status(500).json((0, errorHandler_1.errorResponse)(message, error));
            }
        });
    }
    /**
    * Update the status of an order
    * @param req - HTTP request
    * @param res - HTTP response
    */
    updateOrderStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.params;
                const { status } = req.body;
                // Validate request parameters
                if (!orderId || !status) {
                    res
                        .status(400)
                        .json((0, errorHandler_1.errorResponse)('Order ID and status are required', null));
                    return;
                }
                // Call the service to update the order status
                const result = yield order_service_1.default.updateOrderStatus(orderId, status);
                if (!result.success) {
                    res.status(400).json((0, errorHandler_1.errorResponse)(result.message, null));
                    return;
                }
                res.json((0, successHandler_1.successResponse)('Order status updated successfully', result));
            }
            catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : 'An error occurred while updating the order status';
                res.status(500).json((0, errorHandler_1.errorResponse)(message, error));
            }
        });
    }
}
exports.default = new OrderController();
