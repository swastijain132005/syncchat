import express from "express";
import { getUsersForSidebar ,getMessages,markMessageAsSeen,sendMessage } from "../controllers/message.controller.js";
import { authmiddleware } from "../middleware/auth.js";

const messageRouter = express.Router();

messageRouter.use(authmiddleware);
messageRouter.get("/sidebar", getUsersForSidebar);
messageRouter.get("/:id", getMessages);
messageRouter.put("/markAsSeen/:id", markMessageAsSeen);
messageRouter.post("/send", sendMessage);

export default messageRouter;