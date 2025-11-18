import * as GamemodeController from "../controllers/gamemode.controller.js";
import { Router } from "express";

const GamemodeRouter = Router();
GamemodeRouter.get("/id/:id", GamemodeController.handleGetGamemodeById);
GamemodeRouter.get("/all", GamemodeController.handleGetAllGamemodes);

export default GamemodeRouter;
