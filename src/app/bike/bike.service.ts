// import bike model modules
import BikeModel, { IBikeDocument } from './bike.model';

class BikeService {
  /**
   * Create a new bike
   * @param bikeData - Data to create a bike
   * @returns Created bike document
   */

  async createBike(bikeData: IBikeDocument): Promise<IBikeDocument | null> {
    const bike = new BikeModel(bikeData);
    return await bike.save();
  }

  /**
   * Get All Bikes
   * @returns all bike documents
   */

  async getBikes(query: Record<string, unknown>): Promise<IBikeDocument[]> {
    const bikes = await BikeModel.find(query);
    return bikes;
  }

  /**
   * Get a Specific Bike
   * @param id (ObjectId) - Data to create a bike
   * @returns matched bike document
   */

  async getSpecificBike(id: string): Promise<IBikeDocument | null> {
    const bike = await BikeModel.findById(id)
    return bike
  }
}

export default new BikeService();
