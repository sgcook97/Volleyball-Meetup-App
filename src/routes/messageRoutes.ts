import express, { Request, Response, Router } from "express";
import { Message } from "../models/Message";
import verifyToken from "../middlewares/authJwt";

const messageRouter: Router = express.Router();

messageRouter.get("/:senderId/:receiverId", verifyToken, async (req: Request, res: Response) => {
    const senderId = req.params.senderId;
    const receiverId = req.params.receiverId;
    
    try {
        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error retrieving messages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

messageRouter.post("/", verifyToken, async (req: Request, res: Response) => {
    const { senderId, receiverId, content } = req.body;
    const newMessage = new Message({ senderId, receiverId, content });
    try {
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default messageRouter;