import express from "express";
import * as CivilizationController from "../controllers/civilization.controller";

const CivilizationRouter = express.Router();

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
