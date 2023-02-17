import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { client } from "../../database";
import { returnUserSchemaWithoutPassword } from "../../schemas/users.schemas";

export const recoverUserService = async (userId: number) => {
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
    "active",
    true
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [userId],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  const queryResultWithPassowrd = returnUserSchemaWithoutPassword.parse(
    queryResult.rows[0]
  );

  return queryResultWithPassowrd;
};
