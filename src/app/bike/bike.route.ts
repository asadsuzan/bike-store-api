// import core modules 
import express from "express";
const router = express.Router()
// import bike controller modules
import BikeController from "./bike.controller";

/**
 * create a new bike
 * @endpoint  /api/products
 * @method: POST
 */

router.post('/products', BikeController.createBike)

export default router
