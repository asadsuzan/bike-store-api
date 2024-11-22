// Import core modules
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors'; // Middleware for enabling CORS
import helmet from 'helmet'; // Middleware for security headers

// import routes 
import bikeRoutes from './app/bike/bike.route'
// Create the Express app
const app: Application = express();

// Global middlewares
app.use(express.json()); // Middleware to parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded payloads
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Secure app by setting various HTTP headers


// use the bike route
app.use('/api', bikeRoutes)


// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
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
    stack: '',  // Optionally include the stack trace
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERROR] ${err.message}`); // Log the error message for debugging
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});
// Export the app instance
export default app;
