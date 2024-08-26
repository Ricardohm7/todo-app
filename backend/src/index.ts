import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

import connectDB from './config/database';
import taskRoutes from './routes/task.routes';
import subtaskRoutes from './routes/subtask.routes';
import commentRoutes from './routes/comment.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import {corsOptions} from './config/cors.config';
import {config} from './config';
import cookieParser from 'cookie-parser';

const app = express();
// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

(async () => {
  try {
    await connectDB();

    app.use('/api/tasks', taskRoutes);
    app.use('/api/subtasks', subtaskRoutes);
    app.use('/api/comments', commentRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);

    app.get('/', (req, res) => {
      res.send('Todo List API');
    });

    app.listen(config.serverPort, () => {
      console.log(`Server is running on port ${config.serverPort}`);
    });
  } catch (error) {
    console.log(
      'Failed to connect to the database. Server not started.',
      error,
    );
  }
})();
