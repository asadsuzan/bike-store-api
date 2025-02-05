/* eslint-disable @typescript-eslint/no-explicit-any */
// import bike model modules
import { TMeta } from './bike.interface';
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
    [key: string]: any;
  }): Promise<TMeta | null> {
    const { search, page = 1, limit = 5, ...filterFields } = filters;
    const skip = (page - 1) * limit;
    const query: Record<string, any> = { isDeleted: false };

    // Handle search query
    if (search?.trim()) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Handle dynamic filters
    for (const field in filterFields) {
      if (field === 'price' && typeof filterFields[field] === 'object') {
        query[field] = filterFields[field];
      } else if (field === 'category') {
        query[field] = { $in: filterFields[field] };
      } else {
        query[field] = filterFields[field];
      }
    }

    // Fetch paginated bikes
    const bikes = await BikeModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await BikeModel.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return {
      data: bikes,
      meta: {
        total,
        currentPage: page,
        totalPages,
        limit,
      },
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
