// import core modules
import { Request, Response, NextFunction } from 'express';

// import generic error handler
import { errorResponse } from '../utils/errorHandler';

const validateQuery = (req: Request, res: Response, next: NextFunction) => {
  const { searchTerm } = req.query;

  if (searchTerm && String(searchTerm).length < 3) {
    res.status(400).json(
      errorResponse(
        'Invalid searchTerm. It must be at least 3 characters long.',
        {
          searchTerm,
        },
      ),
    );

    return;
  }

  next();
};

export default validateQuery;
