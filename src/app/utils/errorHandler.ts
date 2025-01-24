// errorHandler.ts

/**
 * Helper function to format the error response
 * @param message - A brief error message
 * @param error - The actual error object or name
 * @param stack - The stack trace
 * @returns A structured error response
 */
interface ErrorResponse {
  message: string;
  success: boolean;
  error: unknown;
  stack: string;
}

export function errorResponse(
  message: string,
  error: unknown,
  stack?: string,
): ErrorResponse {
  return {
    message,
    success: false,
    error,
    stack: stack || (error as Error)?.stack || 'No stack trace available',
  };
}
