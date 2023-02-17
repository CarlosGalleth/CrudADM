import { request, Request, Response } from "express";
import { IUpdateUserWithId, IUserData } from "../interfaces/users.interfaces";
import { createUserService } from "../services/users/createUser.service";
import { updateUserService } from "../services/users/updateUser.service";
import { recoverUserService } from "../services/users/recoverUser.service";
import {
  listUserProfileService,
  listUsersService,
} from "../services/users/listUsers.service";
import { deleteUserService } from "../services/users/deleteUser.service";

export const createUserController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const userData: IUserData = request.body;

  const createUser = await createUserService(userData);

  return response.status(201).json(createUser);
};

export const getUsersController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const user = await listUsersService();

  return response.json(user);
};

export const getUserProfileController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const userProfile = await listUserProfileService(request);

  return response.json(userProfile);
};

export const patchUserController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const updateUser = await updateUserService(request);

  return response.status(200).json(updateUser);
};

export const recoverUserContorller = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const userId: number = Number(request.params.id);

  const recoverUser = await recoverUserService(userId);

  return response.status(200).json(recoverUser);
};

export const deleteUserController = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const userId: number = Number(request.params.id);

  await deleteUserService(userId);

  return response.status(204).json();
};
