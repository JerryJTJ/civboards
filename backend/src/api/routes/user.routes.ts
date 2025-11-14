import * as UserController from "../controllers/user.controller.js";
import { Router } from "express";

const UserRouter = Router();
UserRouter.get("", UserController.handleGetAllUsers);

export default UserRouter;
