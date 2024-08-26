import express from 'express';
import * as taskController from '../controllers/task.controller';
import {authMiddleware} from '../middleware/auth.middleware';

const router = express.Router();
router.use(authMiddleware);

router.post('/', taskController.createTask);
router.get('/user/:userId', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.patch('/:id/status', taskController.updateTaskStatus);

export default router;
