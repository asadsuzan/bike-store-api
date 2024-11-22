// errorHandler.ts

/**
 * Helper function to format the error response
 * @param message - A brief error message
 * @param error - The actual error object or name
 * @param stack - The stack trace 
 * @returns A structured error response
 */
export function errorResponse(
    message: string,
    error: any,
    stack?: string
) {
    return {
        message,
        success: false,
        error,
        stack: stack || error?.stack || 'No stack trace available',
    };
}

