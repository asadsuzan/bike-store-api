"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import core modules 
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// import bike controller modules
const bike_controller_1 = __importDefault(require("./bike.controller"));
/**
 * create a new bike
 * @endpoint  /api/products
 * @method: POST
 */
router.post('/products', bike_controller_1.default.createBike);
/**
 * Get All Bikes
 * @endpoint  /api/products
 * @method: GET
 */
router.get('/products', bike_controller_1.default.getBikes);
exports.default = router;
