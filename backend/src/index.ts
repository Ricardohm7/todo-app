// import './models/task.model';
// import './models/subtask.model';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database';
import taskRoutes from './routes/task.routes';
import subtaskRoutes from './routes/subtask.routes';
import commentRoutes from './routes/comment.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
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

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(
      'Failed to connect to the database. Server not started.',
      error,
    );
  }
})();
