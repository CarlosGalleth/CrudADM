import { hashSync } from "bcryptjs";
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email().max(100),
  password: z.string().transform((password) => {
    return hashSync(password, 10);
  }),
  admin: z.boolean().optional(),
});

export const returnUserSchema = createUserSchema.extend({
  id: z.number(),
  active: z.boolean(),
});

export const returnUserSchemaWithoutPassword = returnUserSchema.omit({
  password: true,
});
export const allUsersSchema = z.array(returnUserSchemaWithoutPassword);

export const updateUserSchema = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email().max(100),
  password: z.string().transform((password) => {
    return hashSync(password, 10);
  }),
});

export const updateUserSchemaWithId = updateUserSchema.extend({
  id: z.number(),
});
