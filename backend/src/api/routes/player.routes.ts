import * as PlayerController from "../controllers/player.controller.js";
import { Router } from "express";

const PlayerRouter = Router();
PlayerRouter.get("/name/:name", PlayerController.handleGetProfileInfoByName);
PlayerRouter.get("/all", PlayerController.handleGetAllUniquePlayers);

export default PlayerRouter;
