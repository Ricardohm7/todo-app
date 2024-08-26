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

    const accessToken = jwt.sign({userId: user._id}, config.jwtSecret, {
      expiresIn: '15m',
    });

    // Generate refresh token
    const refreshToken = jwt.sign(
      {userId: user._id},
      config.jwtRefreshToken,
      {expiresIn: '7d'}, // Long-lived token
    );

    // Set refresh token in HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({accessToken});
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const refresh = async (req: Request, res: Response) => {
  console.log('cookies', req.cookies);
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({message: 'Refresh token not found'});
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, config.jwtRefreshToken) as {
      userId: string;
    };
    const userId = decoded.userId;

    // Generate a new access token
    const accessToken = jwt.sign({userId}, config.jwtSecret, {
      expiresIn: '15m',
    });

    res.json({accessToken});
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    res.status(401).json({message: 'Invalid refresh token'});
  }
};

export const logout = (req: Request, res: Response) => {
  // Clear the refresh token cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({message: 'Logged out successfully'});
};
