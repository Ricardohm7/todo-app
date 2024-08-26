export interface User {
  _id: string;
  username: string;
  email: string;
}

export function mapUserFromApi(data: any): User {
  return {
    _id: data._id,
    username: data.username,
    email: data.email,
  };
}
