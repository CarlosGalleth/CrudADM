import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { client } from "../../database";
import { AppError } from "../../error";
import {
  IUserData,
  IUserDataWithoutPassword,
  IUserDWPResult,
} from "../../interfaces/users.interfaces";
import {
  createUserSchema,
  returnUserSchemaWithoutPassword,
} from "../../schemas/users.schemas";
import { hash } from "bcryptjs";

export const createUserService = async (
  userData: IUserData
): Promise<IUserDataWithoutPassword> => {
  const validatedUserData = createUserSchema.parse(userData);

  const verifyQueryString: string = `
        SELECT
            *
        FROM
            users
        WHERE
            email = $1
    `;

  const verifyQueryConfig: QueryConfig = {
    text: verifyQueryString,
    values: [validatedUserData.email],
  };

  const verifyQueryResult: QueryResult = await client.query(verifyQueryConfig);

  if (verifyQueryResult.rowCount > 0) {
    throw new AppError("User already exists", 409);
  }

  const queryString: string = format(
    `
    INSERT INTO
        users(%I)
    VALUES(%L)
    RETURNING *;
  `,
    Object.keys(validatedUserData),
    Object.values(validatedUserData)
  );

  const queryResult: IUserDWPResult = await client.query(queryString);

  const newUser = returnUserSchemaWithoutPassword.parse(queryResult.rows[0]);

  return newUser;
};
