import {Request, Response} from 'express';
import {Subtask} from '../models/subtask.model';
import {ITask, Task} from '../models/task.model';

import {handleError} from '../utils/errorHandler';
import {TaskStatus} from '../models/status.enum';
import {FilterQuery} from 'mongoose';

export const createTask = async (req: Request, res: Response) => {
  try {
    const {title, description, userId, status} = req.body;
    const task = new Task({title, description, status, createdBy: userId});
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    handleError(res, error);
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const status = req.query.status as string;

    const filter: FilterQuery<ITask> = {createdBy: userId};
    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter)
      .populate('subtasks')
      .populate('comments')
      .populate('createdBy', 'username email'); // Only populate necessary fields from User
    // const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (error) {
    handleError(res, error);
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('subtasks')
      .populate('comments')
      .populate('createdBy', 'username email');

    if (!task) {
      return res.status(404).json({message: 'Task not found'});
    }
    res.json(task);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) {
      return res.status(404).json({message: 'Task not found'});
    }
    res.json(task);
  } catch (error: unknown) {
    handleError(res, error, 400);
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({message: 'Task not found'});
    }
    await Subtask.deleteMany({task: req.params.id});
    res.json({message: 'Task deleted'});
  } catch (error) {
    handleError(res, error);
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({message: 'Task not found'});
    }

    const subtask = await Subtask.find({task: task._id});
    const allSubtasksCompleted = subtask.every(
      (subtask) => subtask.status === TaskStatus.Completed,
    );
    if (req.body.status === TaskStatus.Completed && !allSubtasksCompleted) {
      return res.status(400).json({
        message: 'Cannot mark task as completed when subtasks are pending',
      });
    }
    task.status = req.body.status;
    await task.save();
    res.json(task);
  } catch (error) {
    handleError(res, error, 400);
  }
};
