"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
/**
 * Helper function to format the success response
 * @param message - A success message explaining what went right.
 * @param data - The data returned by the operation (e.g., created bike details).
 * @returns A structured success response.
 */
function successResponse(message, data) {
    return {
        message,
        success: true,
        data,
    };
}
