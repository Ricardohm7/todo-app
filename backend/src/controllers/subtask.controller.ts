import {Request, Response} from 'express';
import {Subtask} from '../models/subtask.model';
import {Task} from '../models/task.model';
import {handleError} from '../utils/errorHandler';
import {TaskStatus} from '../models/status.enum';

export const createSubtask = async (req: Request, res: Response) => {
  try {
    const subtask = new Subtask(req.body);
    await subtask.save();

    const task = await Task.findById(subtask.task);
    if (task) {
      task.subtasks.push(subtask._id);
      await task.save();
    }

    res.status(201).json(subtask);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const updateSubtask = async (req: Request, res: Response) => {
  try {
    const subtask = await Subtask.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!subtask) {
      return res.status(404).json({message: 'Subtask not found'});
    }
    res.json(subtask);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const deleteSubtask = async (req: Request, res: Response) => {
  try {
    const subtask = await Subtask.findByIdAndDelete(req.params.id);
    if (!subtask) {
      return res.status(404).json({message: 'Subtask not found'});
    }

    await Task.findByIdAndUpdate(subtask.task, {
      $pull: {subtasks: subtask._id},
    });
    res.json({message: 'Subtask deleted'});
  } catch (error) {
    handleError(res, error);
  }
};

export const updateSubtaskStatus = async (req: Request, res: Response) => {
  try {
    const subtask = await Subtask.findByIdAndUpdate(
      req.params.id,
      {status: req.body.status},
      {new: true},
    );
    if (!subtask) {
      return res.status(404).json({message: 'Subtask not found'});
    }
    const task = await Task.findById(subtask.task);
    if (task) {
      const allSubtasks = await Subtask.find({task: task._id});
      const allCompleted = allSubtasks.every(
        (st) => st.status === TaskStatus.Completed,
      );
      task.status = allCompleted ? TaskStatus.Completed : TaskStatus.Pending;
      await task.save();
    }
    res.json(subtask);
  } catch (error) {
    handleError(res, error, 400);
  }
};
