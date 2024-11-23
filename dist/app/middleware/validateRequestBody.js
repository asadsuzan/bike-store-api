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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const errorHandler_1 = require("../utils/errorHandler");
/**
 * Middleware to validate and sanitize request body for updating a document.
 * @param model - Mongoose model to fetch the document.
 */
const validateAndPrepareUpdate = (model) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { productId } = req.params;
        const updateData = req.body;
        // Check if ID is a valid ObjectId
        if (!mongoose_1.Types.ObjectId.isValid(productId)) {
            res
                .status(400)
                .json((0, errorHandler_1.errorResponse)(`The provided ID '${productId}' is not a valid ObjectId.`, 'Invalid ID'));
            return;
        }
        try {
            // Find the document by ID
            const document = yield model.findById(productId);
            if (!document) {
                res
                    .status(404)
                    .json((0, errorHandler_1.errorResponse)(`No document found with ID '${productId}`, 'Not Found'));
                return;
            }
            // Extract valid keys from the document's schema
            const validKeys = Object.keys(document.toObject());
            // Filter out invalid keys
            const invalidKeys = Object.keys(updateData).filter((key) => !validKeys.includes(key));
            if (invalidKeys.length > 0) {
                res
                    .status(400)
                    .json((0, errorHandler_1.errorResponse)(`The following fields are invalid: ${invalidKeys.join(', ')}.`, 'Validation Error'));
                return;
            }
            // Prepare sanitized update object
            const sanitizedUpdates = {};
            for (const key of Object.keys(updateData)) {
                sanitizedUpdates[key] = updateData[key];
            }
            // Set sanitized updates to req.body
            req.body = sanitizedUpdates;
            next();
        }
        catch (error) {
            res
                .status(500)
                .json((0, errorHandler_1.errorResponse)('An error occurred while processing your request.', error));
        }
    });
};
exports.default = validateAndPrepareUpdate;
