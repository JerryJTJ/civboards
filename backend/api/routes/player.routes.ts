import express from "express";
import * as PlayerController from "../controllers/player.controller";

const PlayerRouter = express.Router();
PlayerRouter.get("/name/:name", PlayerController.handleGetProfileInfoByName);
PlayerRouter.get("/all", PlayerController.handleGetAllUniquePlayers);

export default PlayerRouter;
