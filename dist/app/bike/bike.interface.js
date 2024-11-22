"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BikeCategory = void 0;
// Enum for bike categories
var BikeCategory;
(function (BikeCategory) {
    BikeCategory["Mountain"] = "Mountain";
    BikeCategory["Road"] = "Road";
    BikeCategory["Hybrid"] = "Hybrid";
    BikeCategory["Electric"] = "Electric";
})(BikeCategory || (exports.BikeCategory = BikeCategory = {}));
