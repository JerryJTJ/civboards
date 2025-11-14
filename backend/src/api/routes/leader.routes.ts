import * as LeaderController from "../controllers/leader.controller.js";
import { Router } from "express";

const LeaderRouter = Router();
LeaderRouter.get("/code/:code", LeaderController.handleGetLeaderByCode);
LeaderRouter.get("/id/:id", LeaderController.handleGetLeaderById);
LeaderRouter.get("/all", LeaderController.handleGetAllLeaders);

export default LeaderRouter;
