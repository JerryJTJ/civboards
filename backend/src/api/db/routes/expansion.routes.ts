import * as ExpansionController from "../controllers/expansion.controller.js";
import { Router } from "express";

const ExpansionRouter = Router();

ExpansionRouter.get(
	"/code/:code",
	ExpansionController.handleGetExpansionByCode
);
ExpansionRouter.get("/id/:id", ExpansionController.handleGetExpansionById);
ExpansionRouter.get("/all", ExpansionController.handleGetAllExpansions);

export default ExpansionRouter;
