import { Request, Response, NextFunction } from 'express';
import { Model, Types } from 'mongoose';
import { IBikeDocument } from '../bike/bike.model';
import { errorResponse } from '../utils/errorHandler';

/**
 * Middleware to validate and sanitize request body for updating a document.
 * @param model - Mongoose model to fetch the document.
 */
const validateAndPrepareUpdate = (model: Model<IBikeDocument>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { productId } = req.params;
    const updateData = req.body;

    // Check if ID is a valid ObjectId
    if (!Types.ObjectId.isValid(productId)) {
      res
        .status(400)
        .json(
          errorResponse(
            `The provided ID '${productId}' is not a valid ObjectId.`,
            'Invalid ID',
          ),
        );
      return;
    }

    try {
      // Find the document by ID
      const document = await model.findById(productId);

      if (!document) {
        res
          .status(404)
          .json(
            errorResponse(
              `No document found with ID '${productId}`,
              'Not Found',
            ),
          );
        return;
      }

      // Extract valid keys from the document's schema
      const validKeys = Object.keys(document.toObject());

      // Filter out invalid keys
      const invalidKeys = Object.keys(updateData).filter(
        (key) => !validKeys.includes(key),
      );

      if (invalidKeys.length > 0) {
        res
          .status(400)
          .json(
            errorResponse(
              `The following fields are invalid: ${invalidKeys.join(', ')}.`,
              'Validation Error',
            ),
          );
        return;
      }

      // Prepare sanitized update object
      const sanitizedUpdates: Record<string, IBikeDocument> = {};
      for (const key of Object.keys(updateData)) {
        sanitizedUpdates[key] = updateData[key];
      }

      // Set sanitized updates to req.body
      req.body = sanitizedUpdates;

      next();
    } catch (error) {
      res
        .status(500)
        .json(
          errorResponse(
            'An error occurred while processing your request.',
            error,
          ),
        );
    }
  };
};

export default validateAndPrepareUpdate;
