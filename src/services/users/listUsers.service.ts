import { query } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../../database";
import { AppError } from "../../error";
import {
  IUserDataWithoutPassword,
  IUserDWPResult,
} from "../../interfaces/users.interfaces";
import { allUsersSchema } from "../../schemas/users.schemas";
import jwt from "jsonwebtoken";

export const listUsersService = async (): Promise<
  Array<IUserDataWithoutPassword>
> => {
  const queryString: string = `
        SELECT
            *
        FROM
            users;
    `;

  const queryResult: IUserDWPResult = await client.query(queryString);

  const queryResultWithPassowrd = allUsersSchema.parse(queryResult.rows);

  return queryResultWithPassowrd;
};

export const listUserProfileService = async (payload: any) => {
  let token = payload.headers.authorization;

  if (!token) {
    throw new AppError("Token is missing", 401);
  }

  token = token.split(" ")[1];

  const user = jwt.decode(token);
  const userId: number = Number(user?.sub);

  const queryString: string = `
    SELECT
      *
    FROM
      users
    WHERE
      id = $1;
  `;

  const QueryConfig: QueryConfig = {
    text: queryString,
    values: [userId],
  };

  const queryResult: QueryResult = await client.query(QueryConfig);

  const queryResultWithPassowrd = allUsersSchema.parse(queryResult.rows);

  return queryResultWithPassowrd[0];
};
