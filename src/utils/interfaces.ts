import { Date } from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
  loggedIn: boolean;
  tasks: ITask[];
}

interface ITask {
  _id: any;
  subject: string;
  deadline: Date;
  status: string;
}

interface ICommonReturn {
  error: boolean;
  message: string;
  data: any;
  status?: number;
}

interface IPartialTask extends Partial<ITask> {}

export { IUser, ITask, IPartialTask, ICommonReturn };
