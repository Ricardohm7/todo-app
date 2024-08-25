import {Request, Response} from 'express';
import {Comment} from '../models/comment.model';
import {Task} from '../models/task.model';
import {handleError} from '../utils/errorHandler';

export const createComment = async (req: Request, res: Response) => {
  try {
    const {taskId, text} = req.body;
    const comment = new Comment({text, task: taskId});
    await comment.save();

    const task = await Task.findById(taskId);
    if (task) {
      task.comments.push(comment._id);
      await task.save();
    }

    res.status(201).json(comment);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const {text} = req.body;
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      {text, updatedAt: new Date()},
      {new: true},
    );
    if (!comment) {
      return res.status(404).json({message: 'Comment not found'});
    }
    res.json(comment);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({message: 'Comment not found'});
    }
    await Task.findByIdAndUpdate(comment.task, {
      $pull: {comments: comment._id},
    });
    res.json({message: 'Comment deleted'});
  } catch (error) {
    handleError(res, error);
  }
};
