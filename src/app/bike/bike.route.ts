// import core modules
import express from 'express';
const router = express.Router();
// import bike controller modules
import BikeController from './bike.controller';

// import custom middlewares
import validateQuery from '../middleware/validateQuery';
import validateAndPrepareUpdate from '../middleware/validateRequestBody';
import BikeModel from './bike.model';

/**
 * create a new bike
 * @endpoint  /api/products
 * @method: POST
 */

router.post('/products', BikeController.createBike);

/**
 * Get All Bikes
 * @endpoint  /api/products
 * @method: GET
 */
router.get('/products', validateQuery, BikeController.getBikes);

/**
 * Get All Bikes
 * @endpoint  /api/products/::productId
 * @method: GET
 */
router.get('/products/:productId', BikeController.getSpecificBike);

/**
 * Update a Bike
 * @endpoint  /api/products/:productId
 * @method: PUT
 */
router.put(
  '/products/:productId',
  validateAndPrepareUpdate(BikeModel),
  BikeController.updateABike,
);
/**
 * Delete a Bike
 * @endpoint  /api/products/:productId
 * @method: DELETE
 */
router.delete('/products/:productId', BikeController.deleteABike);
export default router;
