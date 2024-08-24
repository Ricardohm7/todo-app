import express from 'express';
import * as subtaskController from '../controllers/subtask.controller';

const router = express.Router();

router.post('/', subtaskController.createSubtask);
router.put('/:id', subtaskController.updateSubtask);
router.delete('/:id', subtaskController.deleteSubtask);
router.patch('/:id/status', subtaskController.updateSubtaskStatus);

export default router;
