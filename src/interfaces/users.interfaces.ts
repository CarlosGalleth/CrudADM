import { QueryResult } from "pg";
import { z } from "zod";
import {
  createUserSchema,
  returnUserSchema,
  updateUserSchema,
  updateUserSchemaWithId,
} from "../schemas/users.schemas";

export type IUserData = z.infer<typeof createUserSchema>;
export type IUserDataResult = z.infer<typeof returnUserSchema>;
export type IUserDataWithoutPassword = Omit<IUserDataResult, "password">;
export type IUserDWPResult = QueryResult<IUserDataWithoutPassword>;
export type IUserDataWPassword = QueryResult<IUserDataResult>;
export type IUpdateUser = z.infer<typeof updateUserSchema>;
export type IUpdateUserWithId = z.infer<typeof updateUserSchemaWithId>
