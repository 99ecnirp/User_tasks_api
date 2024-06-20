import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { authConfig, jwtconfig } from "../config";
import { getEmailFromHeader } from "../utils/helper";
import { ERROR_MESSAGES, SUCCESS } from "../utils/constants";
import { getUserByEmail, createUser, updateUser } from "../models/user";

const register = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    let { password } = req.body;

    if (!name || !email || !password) {
      return res.status(500).json({
        error: true,
        message: ERROR_MESSAGES.INVALID_REQUEST_BODY,
        data: {},
      });
    }

    //checking if user's email already present in our database or not
    const {
      error: getUserByEmailError,
      message: getUserByEmailMessage,
      data: getUserByEmailData,
    } = await getUserByEmail(email);

    if (getUserByEmailError) {
      console.error(getUserByEmailMessage);
      return res.status(500).json({
        error: true,
        message: ERROR_MESSAGES.INTERNAL_SERVER,
        data: {},
      });
    } else if (getUserByEmailData) {
      return res.status(422).json({
        error: true,
        message: ERROR_MESSAGES.USER.DUPLICATE,
        data: {},
      });
    }

    //hashing the password before svae
    password = await bcrypt.hash(password, authConfig.hashSaltround);

    const {
      error: createUserError,
      message: createUserMessage,
      data: createUserData,
    } = await createUser({
      name,
      email,
      password,
    });

    if (createUserError) {
      console.error(createUserMessage)
      return res.status(500).json({
        error: true,
        message: ERROR_MESSAGES.INTERNAL_SERVER,
        data: {},
      });
    }

    //generating jwt token for user
    const accessToken = jwt.sign(
      {
        name,
        email,
      },
      jwtconfig.secretKey,
      { expiresIn: `${jwtconfig.expiresInHours}h` }
    );

    return res.status(201).json({
      error: false,
      message: SUCCESS,
      data: {
        id: createUserData._id,
        name,
        email,
        accessToken,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: ERROR_MESSAGES.INTERNAL_SERVER,
      data: {},
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(500).json({
        error: true,
        message: ERROR_MESSAGES.INVALID_REQUEST_BODY,
        data: {},
      });
    }

    //checking is user exists in your database or not
    const {
      error: getUserByEmailError,
      message: getUserByEmailMessage,
      data: getUserByEmailData,
    } = await getUserByEmail(email);

    if (getUserByEmailError) {
      console.error(getUserByEmailMessage);
      return res.status(500).json({
        error: true,
        message: ERROR_MESSAGES.INTERNAL_SERVER,
        data: {},
      });
    } else if (
      !getUserByEmailData ||
      !getUserByEmailData.password ||
      !getUserByEmailData.name
    ) {
      return res.status(401).json({
        error: true,
        message: ERROR_MESSAGES.USER.INVALID_CREDENTIALS,
        data: {},
      });
    }

    //checking password correction
    const isPasswordSame = await bcrypt.compare(
      password,
      getUserByEmailData.password
    );
    if (!isPasswordSame) {
      return res.status(401).json({
        error: true,
        message: ERROR_MESSAGES.USER.INVALID_CREDENTIALS,
        data: {},
      });
    }

    const { error: updateUserError, message: updateUserMessage } =
      await updateUser({ email, loggedIn: true });

    if (updateUserError) {
      console.error(updateUserMessage);
      return res.status(500).json({
        error: true,
        message: ERROR_MESSAGES.INTERNAL_SERVER,
        data: {},
      });
    }

    //genrating jwt token for correct credentials
    const accessToken = jwt.sign(
      {
        name: getUserByEmailData.name,
        email,
      },
      jwtconfig.secretKey,
      { expiresIn: `${jwtconfig.expiresInHours}h` }
    );

    return res.status(200).json({
      error: false,
      message: SUCCESS,
      data: {
        name: getUserByEmailData.name,
        email,
        accessToken,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: ERROR_MESSAGES.INTERNAL_SERVER,
      data: {},
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const email = getEmailFromHeader(req);

    //marking the loggedIn field of user as false
    const { error: updateUserError, message: updateUserMessage } =
      await updateUser({ email, loggedIn: false });

    if (updateUserError) {
      console.error(updateUserMessage)
      return res.status(500).json({
        error: true,
        message: ERROR_MESSAGES.INTERNAL_SERVER,
        data: {},
      });
    }
    return res.status(200).json({
      error: false,
      message: SUCCESS,
      data: {},
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: ERROR_MESSAGES.INTERNAL_SERVER,
      data: {},
    });
  }
};

export default { register, login, logout };
