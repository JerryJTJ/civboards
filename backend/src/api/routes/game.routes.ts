import express from "express";
import * as GameController from "../controllers/game.controller.js";
import checkJwt from "../middlewares/auth/checkJwt.js";

const GameRouter = express.Router();
GameRouter.post("/add", checkJwt, GameController.handleCreateGame);
GameRouter.get("/id/:id", GameController.handleGetGameById);
GameRouter.get("/player/:name", GameController.handleGetAllGamesByPlayer);
GameRouter.get("/uploader/:name", GameController.handleGetAllGamesByCreatedBy);
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
GameRouter.delete("/id/:id", checkJwt, GameController.handleSoftDeleteGame);
GameRouter.patch("/id/:id", checkJwt, GameController.handleUpdateGame);

export default GameRouter;
