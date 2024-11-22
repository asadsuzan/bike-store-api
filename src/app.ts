import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors'; // Middleware for enabling CORS
import helmet from 'helmet'; // Middleware for security headers

// Create the Express app
const app: Application = express();

// Global middlewares
app.use(express.json()); // Middleware to parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded payloads
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Secure app by setting various HTTP headers

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
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
