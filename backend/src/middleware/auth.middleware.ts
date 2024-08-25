import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {config} from '../config';
import {handleError} from '../utils/errorHandler';

interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHandler = req.headers.authorization;
  if (!authHandler) {
    return res.status(401).json({message: 'No token provided'});
  }

  const token = authHandler.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {userId: string};
    req.userId = decoded.userId;
    next();
  } catch (error) {
    handleError(res, error, 401);
  }
};
