import {Response} from 'express';

export const handleError = (
  res: Response,
  error: unknown,
  statusCode: number = 500,
) => {
  if (error instanceof Error) {
    res.status(statusCode).json({message: error.message});
  } else {
    res.status(statusCode).json({message: 'An unknown error occurred'});
  }
};
