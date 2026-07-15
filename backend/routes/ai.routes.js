import express from "express";
import { authmiddleware } from "../middleware/auth.js";
import { smartReplies } from "../controllers/ai.controller.js";


const aiRouter = express.Router();

aiRouter.use(authmiddleware);
aiRouter.post("/smart-replies", smartReplies);



export default aiRouter;