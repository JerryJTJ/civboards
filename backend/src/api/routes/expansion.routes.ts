import express from "express";
import * as ExpansionController from "../controllers/expansion.controller.js";

const ExpansionRouter = express.Router();

ExpansionRouter.get(
	"/code/:code",
	ExpansionController.handleGetExpansionByCode
);
ExpansionRouter.get("/id/:id", ExpansionController.handleGetExpansionById);
ExpansionRouter.get("/all", ExpansionController.handleGetAllExpansions);

export default ExpansionRouter;
