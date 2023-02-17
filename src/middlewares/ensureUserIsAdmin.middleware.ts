import { Request, Response, NextFunction } from "express";
import { AppError } from "../error";
import jwt from "jsonwebtoken";

export const ensureUserIsAdminMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  let token = request.headers.authorization;

  if (!token) {
    throw new AppError("Token is missing", 401);
  }

  token = token.split(" ")[1];

  jwt.verify(token, "cubomagico", (error, decoded: any) => {
    if (error) {
      throw new AppError(error.message, 401);
    }
    if (decoded.admin) {
      return next();
    }
    throw new AppError("Need admin permission", 401);
  });
};
