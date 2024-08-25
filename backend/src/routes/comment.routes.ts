import express from 'express';
import * as commentController from '../controllers/comment.controller';

const router = express.Router();

router.post('/', commentController.createComment);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

export default router;
