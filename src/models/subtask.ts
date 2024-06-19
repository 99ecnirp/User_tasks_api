import mongoose, { ObjectId } from "mongoose";
import userModel from "./User";
import { ERROR_MESSAGES, SUCCESS } from "../utils/constants";
import { ICommonReturn } from "../utils/interfaces";

const getAllSubTasks = async (
  email: string,
  taskId: string,
  needDeletedSubtasks: boolean
): Promise<ICommonReturn> => {
  try {
    const _id = new mongoose.Types.ObjectId(taskId);
    let subtasks;
    if (needDeletedSubtasks) {
      subtasks = "$tasks.subtasks";
    } else {
      subtasks = {
        $filter: {
          input: "$tasks.subtasks",
          as: "subtask",
          cond: {
            $not: { $ifNull: ["$$subtask.deletedAt", needDeletedSubtasks] },
          },
        },
      };
    }
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
        },
      },
      {
        $project: {
          _id: 0,
          tasks: {
            $cond: {
              if: { $not: { $ifNull: ["$tasks.deletedAt", false] } },
              then: {
                status: "$tasks.status",
                subject: "$tasks.subject",
                deadline: "$tasks.deadline",
                _id: "$tasks._id",
                subtasks,
              },
              else: "$$REMOVE",
            },
          },
        },
      },
    ]);
    if (!Array.isArray(result)) {
      return {
        error: true,
        message: "Failed to fetch all subtasks",
        data: {},
      };
    } else if (result.length === 0) {
      return {
        error: true,
        message: ERROR_MESSAGES.TASKS.NOT_FOUND(taskId),
        status: 400,
        data: {},
      };
    } else {
      return {
        error: false,
        message: SUCCESS,
        data: result[0].tasks.subtasks,
      };
    }
  } catch (error) {
    return {
      error: true,
      message: ERROR_MESSAGES.SUBTASKS.FETCH,
      data: error,
    };
  }
};

const updateSubtaskById = async (
  email: string,
  id: string,
  updateSubtaskData: object[]
) => {
  try {
    const _id = new mongoose.Types.ObjectId(id);
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
        $set: {
          "tasks.$.subtasks": updateSubtaskData,
        },
      }
    );
    if (!result || !result.acknowledged) {
      return {
        error: true,
        message: ERROR_MESSAGES.SUBTASKS.UPDATE,
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
      message: ERROR_MESSAGES.SUBTASKS.UPDATE,
      data: error,
    };
  }
};

export { getAllSubTasks, updateSubtaskById };
