import { Request } from "express";

const getEmailFromHeader = (req: Request): string => {
  const email = req.headers.email;
  if (email && typeof email === "string") {
    return email;
  } else {
    throw new Error("Email not found");
  }
};

export { getEmailFromHeader };
