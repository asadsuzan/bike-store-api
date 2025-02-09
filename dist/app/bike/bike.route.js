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
// import custom middlewares
const validateQuery_1 = __importDefault(require("../middleware/validateQuery"));
const validateRequestBody_1 = __importDefault(require("../middleware/validateRequestBody"));
const bike_model_1 = __importDefault(require("./bike.model"));
const auth_1 = __importDefault(require("../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
/**
 * create a new bike
 * @endpoint  /api/products
 * @method: POST
 */
router.post('/products', (0, auth_1.default)(user_constants_1.UserRoles.admin), bike_controller_1.default.createBike);
/**
 * Get All Bikes
 * @endpoint  /api/products
 * @method: GET
 */
router.get('/products', validateQuery_1.default, bike_controller_1.default.getBikes);
/**
 * Get single Bike
 * @endpoint  /api/products/:productId
 * @method: GET
 */
router.get('/products/:productId', bike_controller_1.default.getSpecificBike);
/**
 * Update a Bike
 * @endpoint  /api/products/:productId
 * @method: PUT
 */
router.put('/products/:productId', (0, auth_1.default)(user_constants_1.UserRoles.admin), (0, validateRequestBody_1.default)(bike_model_1.default), bike_controller_1.default.updateABike);
/**
 * Delete a Bike
 * @endpoint  /api/products/:productId
 * @method: DELETE
 */
router.delete('/products/:productId', (0, auth_1.default)(user_constants_1.UserRoles.admin), bike_controller_1.default.deleteABike);
exports.default = router;
