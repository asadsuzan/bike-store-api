// import core modules
import express from 'express';
const router = express.Router();
// import bike controller modules
import BikeController from './bike.controller';

// import custom middlewares
import validateQuery from '../middleware/validateQuery';
import validateAndPrepareUpdate from '../middleware/validateRequestBody';
import BikeModel from './bike.model';
import auth from '../middleware/auth';
import { UserRoles } from '../user/user.constants';

/**
 * create a new bike
 * @endpoint  /api/products
 * @method: POST
 */

router.post('/products', auth(UserRoles.admin), BikeController.createBike);

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
  auth(UserRoles.admin),
  validateAndPrepareUpdate(BikeModel),
  BikeController.updateABike,
);
/**
 * Delete a Bike
 * @endpoint  /api/products/:productId
 * @method: DELETE
 */
router.delete(
  '/products/:productId',
  auth(UserRoles.admin),
  BikeController.deleteABike,
);
export default router;
