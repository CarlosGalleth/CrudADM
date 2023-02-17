import { Request, Response } from "express";
import { NextFunction } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import { AppError } from "../error";

export const ensureUserExistsMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const userId: number = Number(request.params.id);

  const queryString: string = `
    SELECT  
        *
    FROM
        users
    WHERE
        id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [userId],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (!queryResult.rowCount) {
    throw new AppError("User not found", 404);
  }

  return next();
};
