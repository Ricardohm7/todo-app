import mongoose, {Schema, Document} from 'mongoose';
import {ISubtask} from './subtask.model';
import {TaskStatus} from './status.enum';
import {IComment} from './comment.model';

export interface ITask extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  subtasks: ISubtask['_id'][];
  comments: IComment['_id'][];
}

const TaskSchema: Schema = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  status: {
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.Pending,
  },
  subtasks: [{type: Schema.Types.ObjectId, ref: 'Subtask'}],
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
});

export const Task = mongoose.model<ITask>('Task', TaskSchema);
