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

    //extracting accessToken
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

    //decoding data from  jwt
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

    //checking if user exists with email from token data and if its loggedIn status is true or not
    const existingUser = await getUserByEmail(email);
    if (!existingUser || !existingUser.data['loggedIn']) {
      return res.status(400).json({
        error: true,
        message: ERROR_MESSAGES.INVALID_TOKEN,
        data: {},
      });
    }

    //adding the email in header so that can be extracted further
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
