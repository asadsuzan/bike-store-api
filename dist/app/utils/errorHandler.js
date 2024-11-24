"use strict";
// errorHandler.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = errorResponse;
function errorResponse(message, error, stack) {
    return {
        message,
        success: false,
        error,
        stack: stack || (error === null || error === void 0 ? void 0 : error.stack) || 'No stack trace available',
    };
}
