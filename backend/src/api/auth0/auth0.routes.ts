import express from "express";
import * as UsersController from "./users.controller.js";

const Auth0Router = express.Router();
Auth0Router.get(
	"/user/pic/:username",
	UsersController.handleGetPicFromUsername
);

export default Auth0Router;
