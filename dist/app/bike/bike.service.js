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
// import bike model modules
const bike_model_1 = __importDefault(require("./bike.model"));
class BikeService {
    /**
     * Create a new bike
     * @param bikeData - Data to create a bike
     * @returns Created bike document
     */
    createBike(bikeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const bike = new bike_model_1.default(bikeData);
            return yield bike.save();
        });
    }
    /**
     * Get All Bikes
     * @returns all bike documents
     */
    getBikes(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const bikes = yield bike_model_1.default.find(query);
            return bikes;
        });
    }
    /**
     * Get a Specific Bike
     * @param id (ObjectId) - id to retrieves a specific bike
     * @returns matched bike document
     */
    getSpecificBike(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const bike = yield bike_model_1.default.findById(id);
            return bike;
        });
    }
    /**
     * Update a Bike
     * @param id (ObjectId) - id to update a specific bike
     * @param bikeData  - Data to update a bike
     * @returns updated bike document
     */
    updateABike(id, bikeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const bike = yield bike_model_1.default.findByIdAndUpdate(id, bikeData, {
                new: true,
                runValidators: true,
            });
            return bike;
        });
    }
    /**
     *  Delete a Bike
     * @param id (ObjectId) id to delete a specific bike
     * @returns Success message confirming the bike has been deleted.
     */
    deleteABike(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const bike = yield bike_model_1.default.updateOne({ _id: id }, { isDeleted: true });
            return bike;
        });
    }
}
exports.default = new BikeService();
