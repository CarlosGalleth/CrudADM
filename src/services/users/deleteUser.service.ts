import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../../database";

export const deleteUserService = async (userId: number): Promise<void> => {
  const queryString: string = format(
    `
    UPDATE
      users
    SET
      (%I) = row (%L)
    WHERE
      id = $1;
  `,
    "active",
    false
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [userId],
  };

  await client.query(queryConfig);

  return;
};
