import express from "express";
import * as UserController from "../controllers/user.controller.js";

const UserRouter = express.Router();
UserRouter.get("", UserController.handleGetAllUsers);

export default UserRouter;
