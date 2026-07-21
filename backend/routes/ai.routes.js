import express from "express";
import { authmiddleware } from "../middleware/auth.js";
import { smartReplies ,conversationSummary ,toneRewrite ,translate } from "../controllers/ai.controller.js";


const aiRouter = express.Router();

aiRouter.use(authmiddleware);
aiRouter.post("/smart-replies", smartReplies);
aiRouter.post("/summary", conversationSummary);
aiRouter.post("/toneRewrite", toneRewrite);
aiRouter.post("/translate", translate);



export default aiRouter;