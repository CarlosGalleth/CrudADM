import "express-async-errors";
import express, { Application } from "express";
import { handleErrors } from "./error";
import { userRoutes } from "./routers/users.routes";
import { loginRoutes } from "./routers/login.routes";

export const app: Application = express();
app.use(express.json());

app.use("/users", userRoutes);
app.use("/login", loginRoutes);
app.use(handleErrors);
