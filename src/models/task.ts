import mongoose, { ObjectId } from "mongoose";
import userModel from "./User";
import { ITask } from "../utils/interfaces";
import { ERROR_MESSAGES, SUCCESS } from "../utils/constants";

const getAllTasks = async (email: string) => {
  try {
    const result = await userModel.aggregate([
      {
        $match: {
          email,
        },
      },
      {
        $project: {
          tasks: {
            $filter: {
              input: "$tasks",
              as: "task",
              cond: { $not: [{ $ifNull: ["$$task.deletedAt", false] }] },
            },
          },
          _id: 0,
        },
      },
      {
        $project: {
          tasks: {
            $map: {
              input: "$tasks",
              as: "task",
              in: {
                status: "$$task.status",
                subject: "$$task.subject",
                deadline: "$$task.deadline",
                _id: "$$task._id",
                subtasks: {
                  $filter: {
                    input: "$$task.subtasks",
                    as: "subtask",
                    cond: {
                      $not: [{ $ifNull: ["$$subtask.deletedAt", false] }],
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);
    if (!result || !Array.isArray(result)) {
      return {
        error: true,
        message: ERROR_MESSAGES.TASKS.FETCH_ALL,
        data: {},
      };
    } else if (result.length === 0) {
      return {
        error: false,
        message: ERROR_MESSAGES.TASKS.NO_TASKS,
        data: [],
      };
    } else {
      return {
        error: false,
        message: SUCCESS,
        data: result[0].tasks,
      };
    }
  } catch (error) {
    return {
      error: true,
      message: ERROR_MESSAGES.TASKS.FETCH_ALL,
      data: error,
    };
  }
};

const getTaskById = async (email: string, id: string) => {
  try {
    const _id = new mongoose.Types.ObjectId(id);
    const result = await userModel.aggregate([
      {
        $match: {
          email,
        },
      },
      {
        $unwind: "$tasks",
      },
      {
        $match: {
          "tasks._id": _id,
          "tasks.deletedAt": { $exists: false },
        },
      },
      {
        $project: {
          _id: 0,
          task: {
            _id: "$tasks._id",
            status: "$tasks.status",
            subject: "$tasks.subject",
            deadline: "$tasks.deadline",
            subtasks: {
              $filter: {
                input: "$tasks.subtasks",
                as: "subtask",
                cond: { $not: [{ $ifNull: ["$$subtask.deletedAt", false] }] },
              },
            },
          },
        },
      },
    ]);
    if (!result || !Array.isArray(result)) {
      return {
        error: true,
        message: ERROR_MESSAGES.TASKS.FETCH_ONE(id),
        data: {},
      };
    } else if (result.length === 0) {
      return {
        error: true,
        message: ERROR_MESSAGES.TASKS.FETCH_ONE(id),
        data: {},
        status: 400,
      };
    } else {
      return {
        error: false,
        message: SUCCESS,
        data: result[0].tasks,
      };
    }
  } catch (error) {
    return {
      error: true,
      message: ERROR_MESSAGES.TASKS.FETCH_ONE(id),
      data: {},
    };
  }
};

const createTask = async (email: string, newTask: ITask) => {
  try {
    newTask._id = new mongoose.Types.ObjectId();
    const updateInTaskArray = await userModel.updateOne(
      { email },
      { $push: { tasks: newTask } }
    );
    if (!updateInTaskArray || !updateInTaskArray.acknowledged) {
      return {
        error: true,
        message: "Failed to create new task",
        data: {},
      };
    }
    return await getTaskById(email, newTask._id);
  } catch (error) {
    return {
      error: true,
      message: "Failed to create a new task",
      data: {},
    };
  }
};

const updateTaskById = async (
  email: string,
  id: string,
  updateTask: { [key: string]: string }
) => {
  try {
    const _id = new mongoose.Types.ObjectId(id);
    const dataToUpdate: {
      [key: string]: string;
    } = {};
    for (let key in updateTask) {
      dataToUpdate[`tasks.$.${key}`] = updateTask[key];
    }

    const result = await userModel.updateOne(
      {
        email,
        tasks: {
          $elemMatch: {
            _id,
            deletedAt: { $exists: false },
          },
        },
      },
      {
        $set: dataToUpdate,
      }
    );
    if (!result || !result.acknowledged) {
      return {
        error: true,
        message: "Failed to update the task",
        data: {},
      };
    }

    return await getTaskById(email, id);
  } catch (error) {
    return {
      error: true,
      message: "Failed to update the task",
      data: error,
    };
  }
};

const removeTaskById = async (email: string, id: string) => {
  try {
    const updateObj = {
      "tasks.$.deletedAt": new Date(),
    };
    const _id = new mongoose.Types.ObjectId(id);
    const result = await userModel.updateOne(
      { email, "tasks._id": _id },
      { $set: updateObj }
    );
    if (!result || !result.acknowledged) {
      return {
        error: true,
        message: "Failed to delete the task",
        data: {},
      };
    } else {
      return {
        error: false,
        message: SUCCESS,
        data: {},
      };
    }
  } catch (error) {
    return {
      error: true,
      message: "Failed to delete the task",
      data: error,
    };
  }
};

export { getAllTasks, getTaskById, createTask, updateTaskById, removeTaskById };
