import express from 'express';
import * as userController from '../controllers/user.controller';
import {authMiddleware} from '../middleware/auth.middleware';

const router = express.Router();
router.use(authMiddleware);

router.get('/:userId', userController.getUser);

export default router;
