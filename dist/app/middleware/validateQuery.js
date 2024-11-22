"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import generic error handler
const errorHandler_1 = require("../utils/errorHandler");
const validateQuery = (req, res, next) => {
    const { searchTerm } = req.query;
    if (searchTerm && String(searchTerm).length < 3) {
        res.status(400).json((0, errorHandler_1.errorResponse)('Invalid searchTerm. It must be at least 3 characters long.', {
            searchTerm,
        }));
        return;
    }
    next();
};
exports.default = validateQuery;
