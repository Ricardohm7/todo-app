import {Request, Response} from 'express';
import {Subtask} from '../models/subtask.model';
import {Task} from '../models/task.model';

import {handleError} from '../utils/errorHandler';
import {TaskStatus} from '../models/status.enum';

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    handleError(res, error);
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const status = req.body.status as string;
    const filter = status ? {status} : {};
    const tasks = await Task.find(filter).populate('subtasks');
    // const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (error) {
    handleError(res, error);
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
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
