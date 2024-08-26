import {Request, Response} from 'express';
import {User} from '../models/user.model';
import {handleError} from '../utils/errorHandler';

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId).select(
      'username email',
    );
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    res.json({id: user._id, username: user.username, email: user.email});
  } catch (error) {
    handleError(res, error);
  }
};
