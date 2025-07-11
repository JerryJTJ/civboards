import express from "express";
import { handleGetCivilizationIdByCode } from "../controllers/civilizationController";

const CivilizationRouter = express.Router();

CivilizationRouter.get("/:code", handleGetCivilizationIdByCode);

export default CivilizationRouter;
