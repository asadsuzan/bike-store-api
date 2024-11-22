

/**
 * Helper function to format the success response
 * @param message - A success message explaining what went right.
 * @param data - The data returned by the operation (e.g., created bike details).
 * @returns A structured success response.
 */
export function successResponse(message: string, data: any) {
    return {
        message,
        success: true,
        data,
    };
}
