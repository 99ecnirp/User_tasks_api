import { Schema } from "mongoose";

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    loggedIn: {
      type: Boolean,
      required: true,
    },
    tasks: {
      type: Array<object>,
      required: false,
    },
  },
  {
    versionKey: false,
  }
);

export default userSchema;
