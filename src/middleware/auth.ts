import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "../models/user";
import { ERROR_MESSAGES } from "../utils/constants";
import { jwtconfig } from "../config";

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let accessToken = req?.headers?.authorization;
    if (!accessToken || typeof accessToken != "string") {
      return res.status(401).json({
        error: true,
        message: ERROR_MESSAGES.UNAUTHORIZED,
        data: {},
      });
    }
    accessToken = accessToken.split(" ")[1];
    if (!accessToken) {
      return res.status(400).json({
        error: true,
        message: ERROR_MESSAGES.INVALID_TOKEN,
        data: {},
      });
    }

    let decodedInformation
    try {
      decodedInformation = jwt.verify(accessToken, jwtconfig.secretKey);
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: ERROR_MESSAGES.INVALID_TOKEN,
        data: {},
      });
    }

    let email;
    if (decodedInformation &&
      typeof decodedInformation === "object" &&
      "email" in decodedInformation
    ) {
      email = decodedInformation.email;
    } else {
      return res.status(401).json({
        error: true,
        message: ERROR_MESSAGES.UNAUTHORIZED,
        data: {},
      });
    }

    const existingUser = await getUserByEmail(email);
    if (!existingUser || !existingUser.data['loggedIn']) {
      return res.status(400).json({
        error: true,
        message: ERROR_MESSAGES.INVALID_TOKEN,
        data: {},
      });
    }

    req.headers["email"] = email;
    next();
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: true,
      message: ERROR_MESSAGES.INTERNAL_SERVER,
      data: {},
    });
  }
};
