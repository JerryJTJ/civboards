import express from "express";
import * as LeaderController from "../controllers/leader.controller";

const LeaderRouter = express.Router();
LeaderRouter.get("/code/:code", LeaderController.handleGetLeaderByCode);
LeaderRouter.get("/id/:id", LeaderController.handleGetLeaderById);
LeaderRouter.get("/all", LeaderController.handleGetAllLeaders);

export default LeaderRouter;
