import { QueryConfig } from "pg";
import { ILoginData } from "../../interfaces/login.interfaces";
import { client } from "../../database";
import { AppError } from "../../error";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserDataWPassword } from "../../interfaces/users.interfaces";

export const createLoginService = async (
  loginData: ILoginData
): Promise<string> => {
  const queryString: string = `
        SELECT
            *
        FROM
            users
        WHERE
            email = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [loginData.email],
  };

  const queryResult: IUserDataWPassword = await client.query(queryConfig);

  if (!queryResult.rowCount) {
    throw new AppError("Invalid credentials", 401);
  }

  const matchPassword: boolean = await compare(
    loginData.password,
    queryResult.rows[0].password
  );

  if (!matchPassword) {
    throw new AppError("Invalid credentials", 401);
  }

  const token: string = jwt.sign(
    {
      admin: queryResult.rows[0].admin,
    },
    "cubomagico",
    {
      expiresIn: "24h",
      subject: queryResult.rows[0].id.toString(),
    }
  );

  return token;
};
