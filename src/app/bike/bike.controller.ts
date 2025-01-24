// import bike service module
import BikeService from './bike.service';

// import generic error handler
import { errorResponse } from '../utils/errorHandler';
// import generic success handler
import { successResponse } from '../utils/successHandler';
// import core modules
import { Request, Response } from 'express';
import { Types } from 'mongoose';

class BikeController {
  /**
   * crate a new bike
   * @param req - express request object
   * @param res - express response object
   */

  async createBike(req: Request, res: Response): Promise<void> {
    try {
      const bike = await BikeService.createBike(req.body);
      if (!bike) {
        res
          .status(400)
          .json(
            errorResponse(
              'Failed to create bike, Please check your input',
              'Invalid inputs',
            ),
          );
        return;
      }
      res.status(201).json(successResponse('Bike created successfully', bike));
    } catch (error) {
      res
        .status(500)
        .json(
          errorResponse('An error occurred while creating the bike', error),
        );
    }
  }

  /**
   * Get All Bikes
   * @param req - express request object
   * @param res - express response object
   */

  async getBikes(req: Request, res: Response) {
    try {
      const { searchTerm } = req.query;

      // Build the query dynamically
      const query = searchTerm
        ? {
            $or: [
              { name: { $regex: searchTerm, $options: 'i' } },
              { brand: { $regex: searchTerm, $options: 'i' } },
              { category: { $regex: searchTerm, $options: 'i' } },
            ],
          }
        : {};
      const bikes = await BikeService.getBikes(query);

      res
        .status(200)
        .json(
          successResponse(
            searchTerm
              ? `Bikes retrieved successfully for searchTerm: ${searchTerm}`
              : "'Bikes retrieved successfully'",
            bikes,
          ),
        );
    } catch (error) {
      res
        .status(500)
        .json(errorResponse('An error occurred while retrieving bikes', error));
    }
  }

  /**
   * .Get a Specific Bike
   * @param req - express request object
   * @param res - express response object
   */

  async getSpecificBike(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      // check if valid object id
      if (!Types.ObjectId.isValid(productId)) {
        res
          .status(400)
          .json(
            errorResponse(
              `Invalid productId: ${productId}`,
              'Invalid Product id',
            ),
          );
        return;
      }
      const bike = await BikeService.getSpecificBike(productId);
      if (!bike) {
        res
          .status(404)
          .json(
            errorResponse(`No bike found for id: ${productId}`, 'Not Found'),
          );
        return;
      }

      res
        .status(200)
        .json(
          successResponse(
            `Bike Retrieves successfully for id: ${productId}`,
            bike,
          ),
        );
    } catch (error) {
      res
        .status(500)
        .json(
          errorResponse(`Something went wrong when retrieving bike`, error),
        );
    }
  }

  /**
   * .Update a Bike
   * @param req - express request object
   * @param res - express response object
   */
  async updateABike(req: Request, res: Response) {
    const { productId } = req.params;
    const bikeData = req.body;

    try {
      const bike = await BikeService.updateABike(productId, bikeData);
      res.status(200).json(successResponse('Bike updated successfully', bike));
    } catch (error) {
      res
        .status(500)
        .json(errorResponse('Something went wrong when updating', error));
    }
  }
  /**
   * . Delete a Bike
   * @param req - express request object
   * @param res - express response object
   */
  async deleteABike(req: Request, res: Response) {
    const { productId } = req.params;
    if (!Types.ObjectId.isValid(productId)) {
      res
        .status(400)
        .json(errorResponse(`Invalid Object Id ${productId}`, 'Invalid ID'));
      return;
    }
    try {
      // check if bike not found
      const bike = await BikeService.getSpecificBike(productId);
      if (!bike) {
        res
          .status(404)
          .json(
            errorResponse(`No Bike found with id: ${productId}`, 'Not Found'),
          );
        return;
      }
      // delete bike
      const deleteBike = await BikeService.deleteABike(productId);
      if (deleteBike.acknowledged === true && deleteBike.modifiedCount === 1) {
        res.status(200).json(successResponse('Bike deleted successfully', {}));
        return;
      }
    } catch (error) {
      res
        .status(500)
        .json(errorResponse(`Something went wrong when deleting bike`, error));
    }
  }
}

export default new BikeController();
