import express from "express";
import * as GameController from "../controllers/game.controller";

const GameRouter = express.Router();
GameRouter.post("/add", GameController.handleCreateGame);
GameRouter.get("/id/:id", GameController.handleGetGameById);
GameRouter.get("/player/:name", GameController.handleGetAllGamesByPlayer);
GameRouter.get("/all", GameController.handleGetAllGames);
GameRouter.get("/winners/players", GameController.handleGetAllGameWinners);
GameRouter.get(
	"/winners/leaders",
	GameController.handleGetAllGameWinnerLeaderIds
);
GameRouter.get(
	"/winners/civilizations",
	GameController.handleGetAllGameWinnerCivilizationIds
);
GameRouter.get("/winners/victories", GameController.handleGetAllGameVictoryIds);
GameRouter.delete("/id/:id", GameController.handleSoftDeleteGame);
GameRouter.patch("/id/:id", GameController.handleUpdateGame);

export default GameRouter;
