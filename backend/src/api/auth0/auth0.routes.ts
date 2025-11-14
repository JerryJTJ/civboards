import * as UsersController from "./users.controller.js";
import { Router } from "express";

const Auth0Router = Router();
Auth0Router.get(
	"/user/pic/:username",
	UsersController.handleGetPicFromUsername
);

export default Auth0Router;
