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

export enum BikeCategory {
  Robotic = 'Robotic',
  Manual = 'Manual',
  Reflectorless = 'Reflectorless',
  Construction = 'Construction',
  Specialized = 'Specialized',
}

// Brand Enum
export enum BikeBrand {
  LeicaGeosystems = 'Leica Geosystems',
  Trimble = 'Trimble',
  Topcon = 'Topcon',
  Sokkia = 'Sokkia',
  Nikon = 'Nikon',
  Pentax = 'Pentax',
  SouthSurveying = 'South Surveying & Mapping Technology',
  Stonex = 'Stonex',
  Ruide = 'Ruide',
  HiTarget = 'Hi-Target',
}
// Interface for the Bike model
export interface IBike {
  name: string;
  brand: BikeBrand;
  price: number;
  category: BikeCategory;
  description: string;
  quantity: number;
  image: string;
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
