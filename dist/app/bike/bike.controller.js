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
// import bike service module
const bike_service_1 = __importDefault(require("./bike.service"));
// import generic error handler
const errorHandler_1 = require("../utils/errorHandler");
// import generic success handler
const successHandler_1 = require("../utils/successHandler");
const mongoose_1 = require("mongoose");
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
    /**
     * crate a new bike
     * @param req - express request object
     * @param res - express response object
     */
    getBikes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { searchTerm } = req.query;
                // Build the query dynamically
                const query = searchTerm
                    ? {
                        $or: [
                            { name: { $regex: searchTerm, $options: 'i' } },
                            { brand: { $regex: searchTerm, $options: 'i' } },
                            { category: { $regex: searchTerm, $options: 'i' } },
                        ],
                    }
                    : {};
                const bikes = yield bike_service_1.default.getBikes(query);
                res
                    .status(200)
                    .json((0, successHandler_1.successResponse)(searchTerm
                    ? `Bikes retrieved successfully for searchTerm: ${searchTerm}`
                    : "'Bikes retrieved successfully'", bikes));
            }
            catch (error) {
                res
                    .status(500)
                    .json((0, errorHandler_1.errorResponse)('An error occurred while retrieving bikes', error));
            }
        });
    }
    /**
     * . Get a Specific Bike
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
     * . Update a Bike
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
}
exports.default = new BikeController();
