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
    const bike = await BikeModel.findById(id);
    return bike;
  }
  /**
   * Update a Bike
   * @param id (ObjectId) - Data to create a bike
   * @param bikeData  - Data to update a bike
   * @returns updated bike document
   */
  async updateABike(id: string, bikeData: IBikeDocument) {
    const bike = await BikeModel.findByIdAndUpdate(id, bikeData, {
      new: true,
      runValidators: true,
    });

    return bike;
  }
  /**
   *  Delete a Bike
   * @param id (ObjectId)
   * @returns Success message confirming the bike has been deleted.
   */
  async deleteABike(id: string) {
    const bike = await BikeModel.updateOne({ _id: id }, { isDeleted: true });
    return bike;
  }
}

export default new BikeService();
