// import './models/task.model';
// import './models/subtask.model';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database';
import taskRoutes from './routes/task.routes';
import subtaskRoutes from './routes/subtask.routes';
import commentRoutes from './routes/comment.routes';
import authRoutes from './routes/auth.routes';
import {corsOptions} from './config/cors.config';
import {config} from './config';

dotenv.config();

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

(async () => {
  try {
    await connectDB();

    app.use('/api/tasks', taskRoutes);
    app.use('/api/subtasks', subtaskRoutes);
    app.use('/api/comments', commentRoutes);
    app.use('/api/auth', authRoutes);

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
