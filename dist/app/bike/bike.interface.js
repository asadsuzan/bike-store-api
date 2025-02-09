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
exports.BikeBrand = exports.BikeCategory = void 0;
var BikeCategory;
(function (BikeCategory) {
    BikeCategory["Mountain Bikes"] = "Mountain Bikes";
    BikeCategory["Road Bikes"] = "Road Bikes";
    BikeCategory["Hybrid Bikes"] = "Hybrid Bikes";
    BikeCategory["Electric Bikes"] = "Electric Bikes";
})(BikeCategory || (exports.BikeCategory = BikeCategory = {}));
// Brand Enum
var BikeBrand;
(function (BikeBrand) {
    BikeBrand["Suzuki Zixer"] = "Suzuki Zixer";
    BikeBrand["Giant"] = "Giant";
    BikeBrand["Trek"] = "Trek";
    BikeBrand["Cannondale"] = "Cannondale";
    BikeBrand["Specialized"] = "Specialized";
    BikeBrand["Scott"] = "Scott";
    BikeBrand["Yamaha"] = "Yamaha";
    BikeBrand["Bianchi"] = "Bianchi";
    BikeBrand["Merida"] = "Merida";
    BikeBrand["Kawasaki"] = "Kawasaki";
})(BikeBrand || (exports.BikeBrand = BikeBrand = {}));
