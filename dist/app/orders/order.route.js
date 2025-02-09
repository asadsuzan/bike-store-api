"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import core modules
const express_1 = __importDefault(require("express"));
const order_controller_1 = __importDefault(require("./order.controller"));
const auth_1 = __importDefault(require("../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const router = express_1.default.Router();
/**
 * create a new order
 * @endpoint  /api/orders
 * @method: POST
 */
router.post('/', (0, auth_1.default)(user_constants_1.UserRoles.customer), order_controller_1.default.createOrder);
/**
 * verify payment
 * @endpoint  /api/orders?order_id=1231424252
 * @method: GET
 */
router.get('/verify-payment', (0, auth_1.default)(user_constants_1.UserRoles.customer, user_constants_1.UserRoles.admin), order_controller_1.default.verifyPayment);
/**
 * get orders
 * @endpoint  /api/order/orders
 * @method: GET
 */
router.get('/orders', (0, auth_1.default)(user_constants_1.UserRoles.customer, user_constants_1.UserRoles.admin), order_controller_1.default.getAllOrders);
/**
 * get orders summary
 * @endpoint  /api/order/get-summary
 * @method: GET
 */
router.get('/summary', (0, auth_1.default)(user_constants_1.UserRoles.customer, user_constants_1.UserRoles.admin), order_controller_1.default.getOderSummary);
/**
 * delete oder
 * @endpoint  /api/order/:orderId
 * @method: GET
 */
router.delete('/:orderId', (0, auth_1.default)(user_constants_1.UserRoles.customer, user_constants_1.UserRoles.admin), order_controller_1.default.deleteOrder);
router.get('/revenue', (0, auth_1.default)(user_constants_1.UserRoles.customer, user_constants_1.UserRoles.admin), order_controller_1.default.getOrderRevenue);
router.get('/sells-overview', (0, auth_1.default)(user_constants_1.UserRoles.admin, user_constants_1.UserRoles.customer), order_controller_1.default.getSellsOverview);
router.get('/recent-orders', (0, auth_1.default)(user_constants_1.UserRoles.admin, user_constants_1.UserRoles.customer), order_controller_1.default.getRecentOrders);
router.put('/status/:orderId', (0, auth_1.default)(user_constants_1.UserRoles.admin), order_controller_1.default.updateOrderStatus);
exports.default = router;
