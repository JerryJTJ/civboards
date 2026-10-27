import { Router } from "express";
import { generateProfileSummary } from "./profile.js";

const GenAIRouter = Router();
GenAIRouter.get("/profile/:player", generateProfileSummary);

export default GenAIRouter;
