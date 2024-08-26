import express from 'express';
import * as taskController from '../controllers/task.controller';
import {authMiddleware} from '../middleware/auth.middleware';

const router = express.Router();
router.use(authMiddleware);

router.post('/', taskController.createTask);
router.get('/user/:userId', taskController.getTasks);
router.get('/:taskId', taskController.getTask);
router.put('/:taskId', taskController.updateTask);
router.delete('/:taskId', taskController.deleteTask);
router.patch('/:taskId/status', taskController.updateTaskStatus);

export default router;
