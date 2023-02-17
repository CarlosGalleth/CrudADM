import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  getUserProfileController,
  getUsersController,
  patchUserController,
  recoverUserContorller,
} from "../controllers/users.controllers";
import { ensureUserExistsMiddleware } from "../middlewares/ensureUserExists.middleware";
import { ensureUserIsAdminMiddleware } from "../middlewares/ensureUserIsAdmin.middleware";

export const userRoutes: Router = Router();

userRoutes.post("", createUserController);
userRoutes.get("", ensureUserIsAdminMiddleware, getUsersController);
userRoutes.get("/profile", ensureUserIsAdminMiddleware, getUserProfileController)
userRoutes.patch("/:id", ensureUserExistsMiddleware, ensureUserIsAdminMiddleware, patchUserController);
userRoutes.put("/:id/recover", ensureUserExistsMiddleware, ensureUserIsAdminMiddleware, recoverUserContorller)
userRoutes.delete("/:id",ensureUserExistsMiddleware, ensureUserIsAdminMiddleware,  deleteUserController);
