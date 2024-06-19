import { Request, Response } from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  removeTaskById,
  updateTaskById,
} from "../models/task";
import { getEmailFromHeader } from "../utils/helper";
import { ERROR_MESSAGES, SUCCESS } from "../utils/constants";

const getById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const email = getEmailFromHeader(req);
    const {
      error: getTaskByIdError,
      message: getTaskByIdMessage,
      status: getTaskBtIdStatus,
      data: getTaskByIdData,
    } = await getTaskById(email, id);
    if (getTaskByIdError) {
      console.error(getTaskByIdMessage);
      return res.status(getTaskBtIdStatus ?? 500).json({
        error: true,
        message: getTaskByIdMessage,
        data: getTaskByIdData,
      });
    }
    return res.status(200).json({
      error: false,
      message: SUCCESS,
      data: getTaskByIdData,
    });
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: ERROR_MESSAGES.INTERNAL_SERVER,
      data: {},
    };
  }
};

const get = async (req: Request, res: Response) => {
  try {
    const email = getEmailFromHeader(req);
    const {
      error: getAllTasksError,
      message: getAllTasksMessage,
      data: getAllTasksData,
    } = await getAllTasks(email);
    if (getAllTasksError) {
      console.error(getAllTasksMessage);
      return res.send(500).json({
        error: true,
        message: getAllTasksMessage,
        data: getAllTasksData,
      });
    } else {
      return res.status(200).json({
        error: false,
        message: getAllTasksMessage,
        data: getAllTasksData,
      });
    }
  } catch (error) {
    console.error(error);
    return res.send(500).json({
      error: true,
      message: ERROR_MESSAGES.TASKS.FETCH_ALL,
      data: {},
    });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const email = getEmailFromHeader(req);
    const {
      error: createTaskError,
      message: createTaskMessage,
      data: createTaskData,
    } = await createTask(email, req.body);
    if (createTaskError) {
      console.error(createTaskMessage);
      res.send(500).json({
        error: true,
        message: createTaskMessage,
        data: createTaskData,
      });
    }
    return res.status(200).json({
      error: false,
      message: createTaskMessage,
      data: createTaskData,
    });
  } catch (error) {
    console.error(error);
    res.send(500).json({
      error: true,
      message: ERROR_MESSAGES.INTERNAL_SERVER,
      data: {},
    });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const email = getEmailFromHeader(req);
    const {
      error: updateTaskByIdError,
      message: updateTaskByIdMessage,
      data: updateTaskByIdData,
    } = await updateTaskById(email, id, req.body);
    if (updateTaskByIdError) {
      console.error(updateTaskByIdMessage);
      res.send(500).json({
        error: true,
        message: updateTaskByIdMessage,
        data: updateTaskByIdData,
      });
    }
    return res.status(200).json({
      error: false,
      message: updateTaskByIdMessage,
      data: updateTaskByIdData,
    });
  } catch (error) {
    console.error(error);
    res.send(500).json({
      error: true,
      message: ERROR_MESSAGES.INTERNAL_SERVER,
      data: {},
    });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const email = getEmailFromHeader(req);
    const {
      error: removeTaskByIdError,
      message: removeTaskByIdMessage,
      data: removeTaskByIdData,
    } = await removeTaskById(email, id);
    if (removeTaskByIdError) {
      console.error(removeTaskByIdMessage);
      res.send(500).json({
        error: true,
        message: removeTaskByIdMessage,
        data: removeTaskByIdData,
      });
    }
    return res.status(200).json({
      error: false,
      message: removeTaskByIdMessage,
      data: removeTaskByIdData,
    });
  } catch (error) {
    console.error(error);
    res.send(500).json({
      error: true,
      message: ERROR_MESSAGES.INTERNAL_SERVER,
      data: {},
    });
  }
};

export default { getById, get, create, update, remove };
