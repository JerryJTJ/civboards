import express from "express";
import * as GamemodeController from "../controllers/gamemode.controller";

const GamemodeRouter = express.Router();
GamemodeRouter.get("/id/:id", GamemodeController.handleGetGamemodeById);
GamemodeRouter.get("/all", GamemodeController.handleGetAllGamemodes);

export default GamemodeRouter;
