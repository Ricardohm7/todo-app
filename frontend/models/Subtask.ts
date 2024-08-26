export interface Subtask {
  _id: string;
  title: string;
  status: string;
  task: string;
  // __v:    number;
}

export const mapSubtaskFromApi = (data: any): Subtask => {
  return {
    _id: data._id,
    title: data.title,
    status: data.status,
    task: data.task,
  };
};
