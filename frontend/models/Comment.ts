export interface Comment {
  _id: string;
  text: string;
  task: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export const mapCommentFromApi = (data: any) => {
  return {
    _id: data._id,
    text: data.text,
    task: data.task,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};
