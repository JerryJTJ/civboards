import * as CivilizationController from "../controllers/civilization.controller.js";
import { Router } from "express";

const CivilizationRouter = Router();

CivilizationRouter.get(
	"/code/:code",
	CivilizationController.handleGetCivilizationByCode
);
CivilizationRouter.get(
	"/id/:id",
	CivilizationController.handleGetCivilizationById
);
CivilizationRouter.get(
	"/all",
	CivilizationController.handleGetAllCivilizations
);

export default CivilizationRouter;
