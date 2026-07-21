import express from "express";
import { getUsersForSidebar ,getMessages,markMessageAsSeen,sendMessage,editMessage,deleteMessage ,reactToMessage} from "../controllers/message.controller.js";
import { authmiddleware } from "../middleware/auth.js";

const messageRouter = express.Router();

messageRouter.use(authmiddleware);
messageRouter.get("/sidebar", getUsersForSidebar);
messageRouter.get("/:id", getMessages);
messageRouter.put("/markAsSeen/:id", markMessageAsSeen);
messageRouter.post("/send/:id", sendMessage);
messageRouter.put("/edit/:messageId", editMessage);
messageRouter.delete("/delete/:messageId", deleteMessage);
messageRouter.put(
    "/:messageId/react",
    reactToMessage
);

export default messageRouter;