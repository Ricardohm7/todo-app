import mongoose, {Schema, Document} from 'mongoose';
import {TaskStatus} from './status.enum';

export interface ISubtask extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  task: Schema.Types.ObjectId;
}

const SubtaskSchema: Schema = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  status: {
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.Pending,
  },
  task: {type: Schema.Types.ObjectId, ref: 'Task', required: true},
});

export const Subtask = mongoose.model<ISubtask>('Subtask', SubtaskSchema);
