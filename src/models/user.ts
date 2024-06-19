import mongoose, { Document } from "mongoose";
import { userSchema } from "../schemas";
import { ICommonReturn, IUser } from "../utils/interfaces";
import { ERROR_MESSAGES, SUCCESS } from "../utils/constants";

export interface IUserModel extends IUser, Document {}

const userModel = mongoose.model<IUserModel>("User", userSchema);

const getUserByEmail = async (email: string): Promise<ICommonReturn> => {
  try {
    const userArray = await userModel.find().where({ email });

    if (!Array.isArray(userArray)) {
      return {
        error: true,
        message: ERROR_MESSAGES.USER.FETCH_BY_EMAIL,
        data: {},
      };
    } else {
      return {
        error: false,
        message: SUCCESS,
        data: userArray[0],
      };
    }
  } catch (error) {
    return {
      error: true,
      message: ERROR_MESSAGES.USER.FETCH_BY_EMAIL,
      data: error,
    };
  }
};

const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<ICommonReturn> => {
  try {
    const { name, email, password } = data;
    const newUser = new userModel({
      _id: new mongoose.Types.ObjectId(),
      name,
      email,
      password,
      loggedIn: true,
    });
    const result = await newUser.save();
    if (!result || !result._id) {
      return {
        error: true,
        message: ERROR_MESSAGES.USER.CREATE,
        data: {},
      };
    } else {
      return {
        error: false,
        message: SUCCESS,
        data: result,
      };
    }
  } catch (error) {
    return {
      error: true,
      message: ERROR_MESSAGES.USER.CREATE,
      data: error,
    };
  }
};

const updateUser = async (data: {
  email: string;
  loggedIn: boolean;
}): Promise<ICommonReturn> => {
  try {
    const { email, loggedIn } = data;
    const result = await userModel.updateOne(
      { email },
      {
        $set: {
          loggedIn,
        },
      }
    );
    if (!result || !result.acknowledged) {
      return {
        error: true,
        message: ERROR_MESSAGES.USER.UPDATE,
        data: {},
      };
    } else {
      return {
        error: false,
        message: SUCCESS,
        data: result,
      };
    }
  } catch (error) {
    return {
      error: true,
      message: ERROR_MESSAGES.USER.UPDATE,
      data: error,
    };
  }
};

export default userModel;
export { getUserByEmail, createUser, updateUser };
