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

messageRouter.get('/chats/previous/:currentUser', verifyToken, async (req: Request, res: Response) => {
    const currentUser  = req.params.currentUser;
    
    try {
        const messages = await Message.find({ 
            $or: [
                { senderId: currentUser },
                { receiverId: currentUser }
            ]
        }).populate('senderId receiverId', 'username');

        const usersMap = new Map();
        
        messages.forEach(message => {
            if (message.senderId._id.toString() !== currentUser) {
                usersMap.set(message.senderId._id.toString(), message.senderId);
            }
            if (message.receiverId._id.toString() !== currentUser) {
                usersMap.set(message.receiverId._id.toString(), message.receiverId);;
            }
        });

        const users = Array.from(usersMap.values());

        res.status(200).json(Array.from(users));
    } catch (error) {
        console.error('Error fetching previous chats:', error);
        res.status(500).send({ error: 'Internal server error' });
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