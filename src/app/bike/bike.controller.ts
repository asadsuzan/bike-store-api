// import bike service module
import BikeService from "./bike.service";

// import generic error handler 
import { errorResponse } from "../utils/errorHandler";

// import generic success handler 
import { successResponse } from "../utils/successHandler";
// import core modules
import { Request, Response } from 'express'


class BikeController {
    /**
     * crate a new bike
     * @param req - express request object
     * @param res - express response object
     */

    async createBike(req: Request, res: Response): Promise<void> {
        try {
            const bike = await BikeService.createBike(req.body)
            if (!bike) {
                res.status(400).json(errorResponse('Failed to create bike, Please check your input', "Invalid inputs"))
                return;
            }
            res.status(201).json(successResponse('Bike created successfully', bike))
        } catch (error) {
            console.log(error)
            res.status(500).json(errorResponse('An error occurred while creating the bike', error))
        }
    }
}

export default new BikeController()