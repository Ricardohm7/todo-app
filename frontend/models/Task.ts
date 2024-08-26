import {mapCommentFromApi} from './Comment';
import {mapSubtaskFromApi, Subtask} from './Subtask';
import {TaskStatus} from './taskStatus.enums';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  subtasks: Subtask[];
  comments: Comment[];
  // createdAt: string;
  // updatedAt: string;
}

export interface TaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  userId: string;
}

export function mapTaskFromApi(data: any): Task {
  return {
    _id: data._id,
    title: data.title,
    description: data.description,
    status: data.status,
    subtasks: data.subtasks.map(mapSubtaskFromApi),
    comments: data.comments.map(mapCommentFromApi),
    // createdAt: data.createdAt,
    // updatedAt: data.updatedAt,
  };
}
