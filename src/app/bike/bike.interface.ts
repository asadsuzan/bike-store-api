/*
Product Model (Bike)
name (string): The name of the bike.
brand (string): The manufacturer or brand of the bike.
price (number): Price of the bike.
category (string): Type of bike (e.g., Mountain, Road, Hybrid, Electric). Use enum with exact values (Mountain, Road, Hybrid, Electric).
description (string): A brief description of the bike.
quantity (number): Quantity of the bike available.
inStock (boolean): Indicates if the bike is in stock.

*/

import { IBikeDocument } from './bike.model';

// Enum for bike categories
export enum BikeCategory {
  Mountain = 'Mountain',
  Road = 'Road',
  Hybrid = 'Hybrid',
  Electric = 'Electric',
}

// Interface for the Bike model
export interface IBike {
  name: string;
  brand: string;
  price: number;
  category: BikeCategory;
  description: string;
  quantity: number;
  inStock: boolean;
  isDeleted: boolean;
}

export interface TMeta {
  data: IBikeDocument[];
  meta: {
    total: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}
