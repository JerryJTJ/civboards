import express from "express";
import * as VictoryController from "../controllers/victory.controller";

const VictoryRouter = express.Router();

VictoryRouter.get("/id/:id", VictoryController.handleGetVictoryById);
VictoryRouter.get("/all", VictoryController.handleGetAllVictories);

export default VictoryRouter;
