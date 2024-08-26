import cors from 'cors';
import {config} from '.';

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    console.log('origin', origin);
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      `http://localhost:${config.serverPort}`,
      'http://localhost:3001',
      'http://localhost:3000',
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
