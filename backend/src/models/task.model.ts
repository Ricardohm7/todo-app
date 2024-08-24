import mongoose, {Schema, Document} from 'mongoose';
import {ISubtask} from './subtask.model';

export interface ITask extends Document {
  title: string;
  description: string;
  status: 'pending' | 'completed';
  subtasks: ISubtask['_id'][];
}

const TaskSchema: Schema = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  status: {type: String, enum: ['pending', 'completed'], default: 'pending'},
  subtasks: [{type: Schema.Types.ObjectId, ref: 'Subtask'}],
});

export default mongoose.model<ITask>('Task', TaskSchema);
