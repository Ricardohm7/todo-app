import mongoose, {Schema, Document} from 'mongoose';

export interface ISubtask extends Document {
  title: string;
  status: 'pending' | 'completed';
  task: Schema.Types.ObjectId;
}

const SubtaskSchema: Schema = new Schema({
  title: {type: String, required: true},
  status: {type: String, enum: ['pending', 'completed'], default: 'pending'},
  task: {type: Schema.Types.ObjectId, ref: 'Task', required: true},
});

export default mongoose.model<ISubtask>('Subtask', SubtaskSchema);
