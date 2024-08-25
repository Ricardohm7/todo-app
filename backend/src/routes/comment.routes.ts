import express from 'express';
import * as commentController from '../controllers/comment.controller';
import {authMiddleware} from '../middleware/auth.middleware';

const router = express.Router();
router.use(authMiddleware);

router.post('/', commentController.createComment);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

export default router;
