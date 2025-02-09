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
/* eslint-disable @typescript-eslint/no-explicit-any */
// import bike service module
const bike_service_1 = __importDefault(require("./bike.service"));
// import generic error handler
const errorHandler_1 = require("../utils/errorHandler");
// import generic success handler
const successHandler_1 = require("../utils/successHandler");
const mongoose_1 = require("mongoose");
const bike_model_1 = __importDefault(require("./bike.model"));
class BikeController {
    /**
     * crate a new bike
     * @param req - express request object
     * @param res - express response object
     */
    createBike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bike = yield bike_service_1.default.createBike(req.body);
                if (!bike) {
                    res
                        .status(400)
                        .json((0, errorHandler_1.errorResponse)('Failed to create bike, Please check your input', 'Invalid inputs'));
                    return;
                }
                res.status(201).json((0, successHandler_1.successResponse)('Bike created successfully', bike));
            }
            catch (error) {
                res
                    .status(500)
                    .json((0, errorHandler_1.errorResponse)('An error occurred while creating the bike', error));
            }
        });
    }
    // /**
    //  * Get All Bikes
    //  * @param req - express request object
    //  * @param res - express response object
    //  */
    // async getBikes(req: Request, res: Response) {
    //   try {
    //     const { search, page, limit, brand, category, minPrice, maxPrice } =
    //       req.query;
    //     const filters: any = {
    //       page: Number(page) || 1,
    //       limit: Number(limit) || 5,
    //       search: search?.toString(),
    //     };
    //     if (brand) filters.brand = brand;
    //     if (category) filters.category = category;
    //     if (minPrice || maxPrice) {
    //       filters.price = {};
    //       if (!isNaN(Number(minPrice))) filters.price.$gte = Number(minPrice);
    //       if (!isNaN(Number(maxPrice))) filters.price.$lte = Number(maxPrice);
    //     }
    //     const result = await BikeService.getBikes(filters);
    //     res.status(200).json(result);
    //   } catch (error) {
    //     const message = (error as any).message || 'Internal server error';
    //     res.status(500).json({ error: message });
    //   }
    // }
    getBikes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search, page, limit, brand, category, minPrice, maxPrice } = req.query;
                const filters = {
                    page: Number(page) || 1,
                    limit: Number(limit) || 5,
                    search: search === null || search === void 0 ? void 0 : search.toString(),
                };
                if (brand)
                    filters.brand = brand;
                if (category)
                    filters.category = category;
                // Handle price filters
                filters.price = {};
                if (!isNaN(Number(minPrice)))
                    filters.price.$gte = Number(minPrice);
                if (!maxPrice) {
                    // Fetch the highest price from the database if maxPrice is not provided
                    const highestPriceDoc = yield bike_model_1.default.findOne({})
                        .sort({ price: -1 })
                        .select('price');
                    const highestPrice = (highestPriceDoc === null || highestPriceDoc === void 0 ? void 0 : highestPriceDoc.price) || 0;
                    filters.price.$lte = highestPrice;
                }
                else if (!isNaN(Number(maxPrice))) {
                    filters.price.$lte = Number(maxPrice);
                }
                const result = yield bike_service_1.default.getBikes(filters);
                res.status(200).json(result);
            }
            catch (error) {
                const message = error.message || 'Internal server error';
                res.status(500).json({ error: message });
            }
        });
    }
    /**
     * .Get a Specific Bike
     * @param req - express request object
     * @param res - express response object
     */
    getSpecificBike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.params;
                // check if valid object id
                if (!mongoose_1.Types.ObjectId.isValid(productId)) {
                    res
                        .status(400)
                        .json((0, errorHandler_1.errorResponse)(`Invalid productId: ${productId}`, 'Invalid Product id'));
                    return;
                }
                const bike = yield bike_service_1.default.getSpecificBike(productId);
                if (!bike) {
                    res
                        .status(404)
                        .json((0, errorHandler_1.errorResponse)(`No bike found for id: ${productId}`, 'Not Found'));
                    return;
                }
                res
                    .status(200)
                    .json((0, successHandler_1.successResponse)(`Bike Retrieves successfully for id: ${productId}`, bike));
            }
            catch (error) {
                res
                    .status(500)
                    .json((0, errorHandler_1.errorResponse)(`Something went wrong when retrieving bike`, error));
            }
        });
    }
    /**
     * .Update a Bike
     * @param req - express request object
     * @param res - express response object
     */
    updateABike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.params;
            const bikeData = req.body;
            try {
                const bike = yield bike_service_1.default.updateABike(productId, bikeData);
                res.status(200).json((0, successHandler_1.successResponse)('Bike updated successfully', bike));
            }
            catch (error) {
                res
                    .status(500)
                    .json((0, errorHandler_1.errorResponse)('Something went wrong when updating', error));
            }
        });
    }
    /**
     * . Delete a Bike
     * @param req - express request object
     * @param res - express response object
     */
    deleteABike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.params;
            if (!mongoose_1.Types.ObjectId.isValid(productId)) {
                res
                    .status(400)
                    .json((0, errorHandler_1.errorResponse)(`Invalid Object Id ${productId}`, 'Invalid ID'));
                return;
            }
            try {
                // check if bike not found
                const bike = yield bike_service_1.default.getSpecificBike(productId);
                if (!bike) {
                    res
                        .status(404)
                        .json((0, errorHandler_1.errorResponse)(`No Bike found with id: ${productId}`, 'Not Found'));
                    return;
                }
                // delete bike
                const deleteBike = yield bike_service_1.default.deleteABike(productId);
                if (deleteBike.acknowledged === true && deleteBike.modifiedCount === 1) {
                    res.status(200).json((0, successHandler_1.successResponse)('Bike deleted successfully', {}));
                    return;
                }
            }
            catch (error) {
                res
                    .status(500)
                    .json((0, errorHandler_1.errorResponse)(`Something went wrong when deleting bike`, error));
            }
        });
    }
}
exports.default = new BikeController();
