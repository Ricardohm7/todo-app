import express from 'express';
import * as subtaskController from '../controllers/subtask.controller';
import {authMiddleware} from '../middleware/auth.middleware';

const router = express.Router();
router.use(authMiddleware);

router.post('/', subtaskController.createSubtask);
router.put('/:id', subtaskController.updateSubtask);
router.delete('/:id', subtaskController.deleteSubtask);
router.patch('/:id/status', subtaskController.updateSubtaskStatus);

export default router;
