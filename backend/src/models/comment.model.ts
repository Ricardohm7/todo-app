import mongoose, {Document, Schema} from 'mongoose';

export interface IComment extends Document {
  text: string;
  task: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
  text: {type: String, required: true},
  task: {type: Schema.Types.ObjectId, ref: 'Task', required: true},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
