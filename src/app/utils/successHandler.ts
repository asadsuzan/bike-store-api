/**
 * Helper function to format the success response
 * @param message - A success message explaining what went right.
 * @param data - The data returned by the operation (e.g., created bike details).
 * @returns A structured success response.
 */

interface SuccessResponse<T> {
  message: string;
  success: true;
  data: T;
}
export function successResponse<T>(
  message: string,
  data: T,
): SuccessResponse<T> {
  return {
    message,
    success: true,
    data,
  };
}
