import * as VictoryController from "../controllers/victory.controller.js";
import { Router } from "express";

const VictoryRouter = Router();

VictoryRouter.get("/id/:id", VictoryController.handleGetVictoryById);
VictoryRouter.get("/all", VictoryController.handleGetAllVictories);

export default VictoryRouter;
