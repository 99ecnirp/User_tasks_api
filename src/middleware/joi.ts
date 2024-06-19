import Joi, { ArraySchema, ObjectSchema } from "joi";
import { NextFunction, Request, Response } from "express";
import { ITask, IUser } from "../utils/interfaces";

export const ValidateJoi = (schema: ObjectSchema | ArraySchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);

      next();
    } catch (error) {
      console.log(error);

      return res.status(422).json({ error });
    }
  };
};

export const Schemas = {
  user: {
    create: Joi.object<IUser>({
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
    login: Joi.object<{ email: string; password: string }>({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
  task: {
    create: Joi.object<ITask>({
      subject: Joi.string().required(),
      deadline: Joi.date().required(),
      status: Joi.string()
        .valid("To Do", "In Progress", "Backlog", "Done")
        .required(),
    }),
    update: Joi.object<ITask>({
      subject: Joi.string(),
      deadline: Joi.date(),
      status: Joi.string().valid("To Do", "In Progress", "Backlog", "Done"),
    }),
  },
  subtask: {
    update: Joi.array().items(
      Joi.object<ITask>({
        subject: Joi.string(),
        deadline: Joi.date(),
        status: Joi.string().valid("To Do", "In Progress", "Backlog", "Done"),
      })
    ),
  },
};
