"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import core modules
const express_1 = __importDefault(require("express"));
const order_controller_1 = __importDefault(require("./order.controller"));
const router = express_1.default.Router();
/**
 * create a new order
 * @endpoint  /api/orders
 * @method: POST
 */
router.post('/orders', order_controller_1.default.createOrder);
exports.default = router;
