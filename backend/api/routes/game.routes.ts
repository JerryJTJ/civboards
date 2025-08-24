import express from "express";
import * as GameController from "../controllers/game.controller";

const GameRouter = express.Router();
GameRouter.post("/add", GameController.handleCreateGame);
GameRouter.get("/id/:id", GameController.handleGetGameById);
GameRouter.get("/all", GameController.handleGetAllGames);
GameRouter.get("/winners", GameController.handleGetAllGameWinners);
GameRouter.delete("/id/:id", GameController.handleSoftDeleteGame);

export default GameRouter;
