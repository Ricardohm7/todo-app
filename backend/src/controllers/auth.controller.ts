import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {User} from '../models/user.model';
import {handleError} from '../utils/errorHandler';
import {config} from '../config';

export const register = async (req: Request, res: Response) => {
  try {
    const {username, email, password} = req.body;
    const user = new User({username, email, password});
    await user.save();
    res.status(201).json({message: 'User registered successfully'});
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({message: 'Invalid email or password'});
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({message: 'Invalid email or password'});
    }
    const token = jwt.sign({userId: user._id}, config.jwtSecret, {
      expiresIn: '1d',
    });
    res.json({token});
  } catch (error) {
    handleError(res, error, 400);
  }
};
