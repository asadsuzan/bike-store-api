// import core modules
import express from 'express';
const router = express.Router();
// import bike controller modules
import BikeController from './bike.controller';

// import custom middlewares
import validateQuery from '../middleware/validateQuery';

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
 * @endpoint  /api/products
 * @method: GET
 */
router.get('/products/:productId', BikeController.getSpecificBike);



export default router;
