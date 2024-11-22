"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import core modules
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // Middleware for enabling CORS
const helmet_1 = __importDefault(require("helmet")); // Middleware for security headers
// import routes 
const bike_route_1 = __importDefault(require("./app/bike/bike.route"));
// Create the Express app
const app = (0, express_1.default)();
// Global middlewares
app.use(express_1.default.json()); // Middleware to parse incoming JSON requests
app.use(express_1.default.urlencoded({ extended: true })); // Middleware to parse URL-encoded payloads
app.use((0, cors_1.default)()); // Enable Cross-Origin Resource Sharing
app.use((0, helmet_1.default)()); // Secure app by setting various HTTP headers
// use the bike route
app.use('/api', bike_route_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API is running' });
});
// Handle undefined routes
app.all('*', (req, res) => {
    res.status(404).json({
        message: 'Route not found',
        success: false,
        error: {
            name: 'NotFoundError',
            message: 'The requested route does not exist',
        },
        stack: '', // Optionally include the stack trace
    });
});
// Global error handler
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`); // Log the error message for debugging
    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
});
// Export the app instance
exports.default = app;
