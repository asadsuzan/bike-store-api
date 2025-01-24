/* eslint-disable @typescript-eslint/no-explicit-any */
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

  // /**
  //  * Get All Bikes
  //  * @returns all bike documents
  //  */

  // async getBikes(query: Record<string, unknown>): Promise<IBikeDocument[]> {
  //   const bikes = await BikeModel.find(query);
  //   return bikes;
  // }
  /**
   * Get All Bikes with Pagination, Searching, and Filtering
   * @param filters - Query parameters for pagination, searching, and filtering
   * @returns Filtered and paginated bike documents
   */
  async getBikes(filters: {
    search?: string;
    page?: number;
    limit?: number;
    [key: string]: any; // Additional filters like brand, category, etc.
  }): Promise<{
    data: IBikeDocument[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const { search, page = 1, limit = 5, ...filterFields } = filters;

    // Pagination calculation
    const skip = (page - 1) * limit;

    // Base query for filtering
    const query: Record<string, any> = { isDeleted: false };

    // Add search logic (e.g., search in name or description)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } }, // Case-insensitive search
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Add other filters dynamically (e.g., brand, category, price range)
    for (const field in filterFields) {
      query[field] = filterFields[field];
    }

    // Fetch filtered and paginated bikes
    const bikes = await BikeModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by most recent by default

    // Count total documents matching the query
    const total = await BikeModel.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
    return {
      data: bikes,
      total,
      currentPage: page,
      totalPages,
    };
  }
  /**
   * Get a Specific Bike
   * @param id (ObjectId) - id to retrieves a specific bike
   * @returns matched bike document
   */

  async getSpecificBike(id: string): Promise<IBikeDocument | null> {
    const bike = await BikeModel.findById(id);
    return bike;
  }
  /**
   * Update a Bike
   * @param id (ObjectId) - id to update a specific bike
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
   * @param id (ObjectId) id to delete a specific bike
   * @returns Success message confirming the bike has been deleted.
   */
  async deleteABike(id: string) {
    const bike = await BikeModel.updateOne({ _id: id }, { isDeleted: true });
    return bike;
  }
}

export default new BikeService();
