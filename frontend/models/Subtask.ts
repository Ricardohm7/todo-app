import {TaskStatus} from './taskStatus.enums';

export interface Subtask {
  _id: string;
  title: string;
  description: string;
  status: string;
  task: string;
  // __v:    number;
}

export interface SubtaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  task: string;
}

export const mapSubtaskFromApi = (data: any): Subtask => {
  return {
    _id: data._id,
    title: data.title,
    description: data.description,
    status: data.status,
    task: data.task,
  };
};
