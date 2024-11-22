"use strict";
// errorHandler.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = errorResponse;
/**
 * Helper function to format the error response
 * @param message - A brief error message
 * @param error - The actual error object or name
 * @param stack - The stack trace
 * @returns A structured error response
 */
function errorResponse(message, error, stack) {
    return {
        message,
        success: false,
        error,
        stack: stack || (error === null || error === void 0 ? void 0 : error.stack) || 'No stack trace available',
    };
}
