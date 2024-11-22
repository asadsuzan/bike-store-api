// import app module
import app from './app';

// import config module
import config from './config';
const PORT = config.port || 5000;
const DB_URI = config.db_uri;

// import core modules
import mongoose from 'mongoose';

// MAIN FUNCTION TO CONNECT MONGOOSE AND START SERVER

const main = async () => {
  try {
    await mongoose.connect(DB_URI as string);
    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

main();
