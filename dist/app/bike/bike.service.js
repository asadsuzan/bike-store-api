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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    // /**
    //  * Get All Bikes
    //  * @returns all bike documents
    //  */
    // async getBikes(query: Record<string, unknown>): Promise<IBikeDocument[]> {
    //   const bikes = await BikeModel.find(query);
    //   return bikes;
    // }
    /**
     * Get All Bikes with Pagination, Searching, and Filtering
     * @param filters - Query parameters for pagination, searching, and filtering
     * @returns Filtered and paginated bike documents
     */
    getBikes(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { search, page = 1, limit = 5 } = filters, filterFields = __rest(filters, ["search", "page", "limit"]);
            const skip = (page - 1) * limit;
            const query = { isDeleted: false };
            // Handle search query
            if (search === null || search === void 0 ? void 0 : search.trim()) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                ];
            }
            // Handle dynamic filters
            // for (const field in filterFields) {
            //   if (field === 'price' && typeof filterFields[field] === 'object') {
            //     query[field] = filterFields[field];
            //   } else if (field === 'category') {
            //     query[field] = { $in: filterFields[field] };
            //   } else {
            //     query[field] = filterFields[field];
            //   }
            // }
            // Handle dynamic filters
            for (const field in filterFields) {
                if (field === 'price' && typeof filterFields[field] === 'object') {
                    query[field] = filterFields[field];
                }
                else if (field === 'category' && filterFields[field] !== 'All') {
                    query[field] = { $in: filterFields[field] };
                }
                else if (field !== 'category') {
                    query[field] = filterFields[field];
                }
            }
            // Fetch paginated bikes
            const bikes = yield bike_model_1.default.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
            const total = yield bike_model_1.default.countDocuments(query);
            const totalPages = Math.ceil(total / limit);
            return {
                data: bikes,
                meta: {
                    total,
                    currentPage: page,
                    totalPages,
                    limit,
                },
            };
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
