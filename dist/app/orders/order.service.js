"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
const order_model_1 = require("./order.model");
const user_model_1 = __importDefault(require("../user/user.model"));
const order_utils_1 = require("./order.utils");
class OrderService {
    /**
     * Create a new order
     * @param userId - ID of the user placing the order
     * @param items - Array of order items
     * @returns - Created order document or error message
     */
    createOrder(userId, items, client_ip) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedItems = [];
                let totalPrice = 0;
                for (const item of items) {
                    // Get the product details
                    const bike = yield bike_service_1.default.getSpecificBike(item.productId);
                    if (!bike) {
                        return {
                            message: `Product with ID ${item.productId} not found`,
                            success: false,
                            status: 'NOT-Found',
                            item: item.productId,
                        };
                    }
                    // Check stock availability
                    if (!bike.inStock) {
                        return {
                            message: `Product with ID ${item.productId} is out of stock`,
                            success: false,
                            status: 'STOCK-OUT',
                            item: item.productId,
                            availableQuantity: bike.quantity,
                        };
                    }
                    if (bike.quantity < item.quantity) {
                        return {
                            message: `Quantity for product ID ${item.productId} not available`,
                            success: false,
                            status: 'INSUFFICIENT-QUANTITY',
                            item: item.productId,
                            availableQuantity: bike.quantity,
                        };
                    }
                    // Calculate total price and update stock
                    totalPrice += bike.price * item.quantity;
                    bike.quantity -= item.quantity;
                    yield bike.save();
                    updatedItems.push(item);
                }
                // Create the order
                const orderData = {
                    user: userId,
                    items: updatedItems,
                    status: 'Pending',
                    totalPrice,
                };
                let order = yield order_model_1.Order.create(orderData);
                const user = yield user_model_1.default.findById(userId);
                // payment integration
                if (!user) {
                    return {
                        message: 'User not found',
                        success: false,
                    };
                }
                const shurjopayPayload = {
                    amount: totalPrice,
                    order_id: order._id,
                    currency: 'BDT',
                    customer_name: user.name,
                    customer_address: user.address,
                    customer_email: user.email,
                    customer_phone: user.phone,
                    customer_city: user.city,
                    client_ip,
                };
                const payment = yield order_utils_1.orderUtils.makePaymentAsync(shurjopayPayload);
                if (payment === null || payment === void 0 ? void 0 : payment.transactionStatus) {
                    order = yield order.updateOne({
                        transaction: {
                            id: payment.sp_order_id,
                            transactionStatus: payment.transactionStatus,
                        },
                    });
                }
                return {
                    success: true,
                    checkout_url: payment.checkout_url,
                };
            }
            catch (e) {
                return {
                    message: e.message || 'An error occurred while creating the order',
                    success: false,
                };
            }
        });
    }
    verifyPayment(order_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const verifiedPayment = yield order_utils_1.orderUtils.verifyPaymentAsync(order_id);
            try {
                if (verifiedPayment.length) {
                    yield order_model_1.Order.findOneAndUpdate({
                        'transaction.id': order_id,
                    }, {
                        'transaction.bank_status': verifiedPayment[0].bank_status,
                        'transaction.sp_code': verifiedPayment[0].sp_code,
                        'transaction.sp_message': verifiedPayment[0].sp_message,
                        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
                        'transaction.method': verifiedPayment[0].method,
                        'transaction.date_time': verifiedPayment[0].date_time,
                        status: verifiedPayment[0].bank_status == 'Success'
                            ? 'Paid'
                            : verifiedPayment[0].bank_status == 'Failed'
                                ? 'Pending'
                                : verifiedPayment[0].bank_status == 'Cancel'
                                    ? 'Cancelled'
                                    : '',
                    });
                }
                return { success: true, verifiedPayment };
            }
            catch (err) {
                return {
                    message: err.message || 'An error occurred while verifying the payment',
                    success: false,
                };
            }
        });
    }
    // get all orders
    getAllOrders(userId, role, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = role === 'admin' ? order_model_1.Order.find() : order_model_1.Order.find({ user: userId });
                // Apply case-insensitive filtering for status
                if (filters.status) {
                    query = query.where('status').regex(new RegExp(filters.status, 'i'));
                }
                if (filters.startDate && filters.endDate) {
                    query = query
                        .where('createdAt')
                        .gte(new Date(filters.startDate).getTime())
                        .lte(new Date(filters.endDate).getTime());
                }
                if (filters.minPrice && filters.maxPrice) {
                    query = query
                        .where('totalPrice')
                        .gte(filters.minPrice)
                        .lte(filters.maxPrice);
                }
                query = query.sort({ createdAt: -1 });
                const orders = yield query
                    .populate({
                    path: 'items.productId', // Proper way to target productId in nested array
                    model: 'Bike',
                }).populate({
                    path: 'user',
                    model: 'User',
                })
                    .exec();
                return {
                    success: true,
                    orders,
                };
            }
            catch (err) {
                return {
                    message: err.message || 'An error occurred while getting orders',
                    success: false,
                };
            }
        });
    }
    // get summary
    getOrderSummary(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            try {
                const matchCondition = role === 'admin' ? {} : { user: userId };
                const summary = yield order_model_1.Order.aggregate([
                    { $match: matchCondition },
                    {
                        $group: {
                            _id: '$status',
                            count: { $sum: 1 },
                        },
                    },
                    {
                        $facet: {
                            statusCounts: [
                                {
                                    $group: {
                                        _id: '$_id',
                                        count: { $sum: '$count' },
                                    },
                                },
                            ],
                            totalOrders: [
                                {
                                    $group: {
                                        _id: null,
                                        total: { $sum: '$count' },
                                    },
                                },
                            ],
                        },
                    },
                ]);
                const statusCounts = ((_a = summary[0]) === null || _a === void 0 ? void 0 : _a.statusCounts) || [];
                const totalOrders = ((_c = (_b = summary[0]) === null || _b === void 0 ? void 0 : _b.totalOrders[0]) === null || _c === void 0 ? void 0 : _c.total) || 0;
                return {
                    success: true,
                    summary: {
                        allOrders: totalOrders,
                        pending: ((_d = statusCounts.find((item) => item._id === 'Pending')) === null || _d === void 0 ? void 0 : _d.count) || 0,
                        paid: ((_e = statusCounts.find((item) => item._id === 'Paid')) === null || _e === void 0 ? void 0 : _e.count) || 0,
                        shipped: ((_f = statusCounts.find((item) => item._id === 'Shipped')) === null || _f === void 0 ? void 0 : _f.count) || 0,
                        completed: ((_g = statusCounts.find((item) => item._id === 'Completed')) === null || _g === void 0 ? void 0 : _g.count) || 0,
                        cancelled: ((_h = statusCounts.find((item) => item._id === 'Cancelled')) === null || _h === void 0 ? void 0 : _h.count) || 0,
                    },
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: error.message ||
                        'An error occurred while retrieving order summary.',
                };
            }
        });
    }
    // get revenue
    getOderRevenue(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // const matchCondition =
                //   role === 'admin'
                //     ? { status: 'Paid'}
                //     : { user: userId, status: 'Paid' };
                // Define the statuses to match
                const statusesToMatch = ['Pending', 'Shipped', 'Completed'];
                // Define the match condition based on the user's role
                const matchCondition = role === 'admin'
                    ? { status: { $in: statusesToMatch } } // Admin can see all orders with the specified statuses
                    : { user: userId, status: { $in: statusesToMatch } }; // Regular users can only see their own orders with the specified statuses
                const revenue = yield order_model_1.Order.aggregate([
                    { $match: matchCondition },
                    {
                        $group: {
                            _id: null,
                            totalRevenue: { $sum: '$totalPrice' },
                            totalExpense: { $sum: '$totalPrice' },
                        },
                    },
                ]);
                return {
                    success: true,
                    revenue: ((_a = revenue[0]) === null || _a === void 0 ? void 0 : _a.totalRevenue) || 0,
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: error.message ||
                        'An error occurred while retrieving order revenue.',
                };
            }
        });
    }
    // get sells overview
    getSalesOverview(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const matchCondition = role === 'admin' ? {} : { user: userId };
                // Aggregate orders to get total sales per month
                const salesData = yield order_model_1.Order.aggregate([
                    { $match: matchCondition },
                    {
                        $project: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' },
                            totalPrice: 1,
                        },
                    },
                    {
                        $group: {
                            _id: { year: '$year', month: '$month' },
                            totalSales: { $sum: '$totalPrice' },
                        },
                    },
                    {
                        $sort: { '_id.year': 1, '_id.month': 1 },
                    },
                ]);
                // Format the sales data
                const formattedSalesData = salesData.map((entry) => ({
                    month: new Date(entry._id.year, entry._id.month - 1).toLocaleString('default', { month: 'short' }),
                    sales: entry.totalSales,
                }));
                // Ensure that all months are included, even if no sales data exists for some months
                const allMonths = [
                    { month: 'Jan', sales: 0 },
                    { month: 'Feb', sales: 0 },
                    { month: 'Mar', sales: 0 },
                    { month: 'Apr', sales: 0 },
                    { month: 'May', sales: 0 },
                    { month: 'Jun', sales: 0 },
                    { month: 'Jul', sales: 0 },
                    { month: 'Aug', sales: 0 },
                    { month: 'Sep', sales: 0 },
                    { month: 'Oct', sales: 0 },
                    { month: 'Nov', sales: 0 },
                    { month: 'Dec', sales: 0 },
                ];
                formattedSalesData.forEach((entry) => {
                    const monthIndex = allMonths.findIndex((month) => month.month === entry.month);
                    if (monthIndex !== -1) {
                        allMonths[monthIndex].sales = entry.sales;
                    }
                });
                return {
                    success: true,
                    salesOverview: allMonths,
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: error.message || 'An error occurred while retrieving sales overview.',
                };
            }
        });
    }
    /**
     * Delete an order based on user role
     * @param orderId - ID of the order to delete
     * @param userId - ID of the user attempting to delete the order
     * @param role - Role of the user ("admin" or "user")
     * @returns - Success or error message
     */
    deleteOrder(orderId, userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let order;
                if (role === 'admin') {
                    // Admin can delete any order
                    order = yield order_model_1.Order.findByIdAndDelete(orderId);
                }
                else {
                    // Regular user can only delete their own order
                    order = yield order_model_1.Order.findOneAndDelete({ _id: orderId, user: userId });
                }
                if (!order) {
                    return {
                        success: false,
                        message: role === 'admin'
                            ? 'Order not found.'
                            : 'Order not found or you do not have permission to delete it.',
                    };
                }
                return {
                    success: true,
                    message: 'Order deleted successfully.',
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: error.message || 'An error occurred while deleting the order.',
                };
            }
        });
    }
    getRecentOrders(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Determine the query condition based on user role
                const queryCondition = role === 'admin' ? {} : { user: userId };
                // Query the database for the 5 most recent orders
                const recentOrders = yield order_model_1.Order.find(queryCondition)
                    .sort({ createdAt: -1 })
                    .limit(3)
                    .populate({
                    path: 'items.productId',
                    model: 'Bike',
                })
                    .populate({
                    path: 'user',
                    model: 'User',
                });
                return {
                    success: true,
                    orders: recentOrders,
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: error.message || 'An error occurred while retrieving orders.',
                };
            }
        });
    }
    /**
   * Update the status of an order
   * @param orderId - ID of the order to update
   * @param newStatus - New status to set
   * @returns - Success or error response
   */
    updateOrderStatus(orderId, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Validate the new status
                const validStatuses = ['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'];
                if (!validStatuses.includes(newStatus)) {
                    return {
                        success: false,
                        message: 'Invalid status provided.',
                    };
                }
                // Fetch the existing order
                const order = yield order_model_1.Order.findById(orderId);
                if (!order) {
                    return {
                        success: false,
                        message: 'Order not found.',
                    };
                }
                const currentStatus = order.status;
                // Define valid status transitions
                const statusTransitions = {
                    Pending: ['Cancelled', 'Paid'],
                    Paid: ['Shipped'],
                    Shipped: ['Completed'],
                    Completed: [],
                    Cancelled: [],
                };
                // Check if the new status is a valid transition
                if (!((_a = statusTransitions[currentStatus]) === null || _a === void 0 ? void 0 : _a.includes(newStatus))) {
                    return {
                        success: false,
                        message: `Cannot transition from ${currentStatus} to ${newStatus}.`,
                    };
                }
                // Update the order status
                order.status = newStatus;
                yield order.save();
                return {
                    success: true,
                    message: `Order status updated to ${newStatus}.`,
                    order,
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: error.message || 'An error occurred while updating the order status.',
                };
            }
        });
    }
}
exports.default = new OrderService();
