import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { client } from "../../database";
import { AppError } from "../../error";
import {
  IUpdateUser,
  IUpdateUserWithId,
  IUserDWPResult,
} from "../../interfaces/users.interfaces";
import { returnUserSchemaWithoutPassword } from "../../schemas/users.schemas";

export const updateUserService = async (request: any) => {
  const userData: IUpdateUserWithId = request.body;
  const dataKeys = Object.keys(userData);
  const dataValues = Object.values(userData);
 
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
    values: [userData.email],
  };

  const verifyQueryResult: QueryResult = await client.query(verifyQueryConfig);

  if (verifyQueryResult.rowCount > 0) {
    throw new AppError("User already exists", 409);
  }

  const queryString: string = format(
    `
    UPDATE
      users
    SET
      (%I) = row (%L)
    WHERE
      id = $1
    RETURNING *;
`,
    dataKeys,
    dataValues
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [Number(request.params.id)],
  };

  const queryResult: IUserDWPResult = await client.query(queryConfig);

  const queryResultWithPassowrd = returnUserSchemaWithoutPassword.parse(
    queryResult.rows[0]
  );

  return queryResultWithPassowrd;
};
