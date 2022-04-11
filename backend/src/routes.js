import express from "express";
import { io } from "./app";
import { Message } from "./models/Message";

const router = express.Router();

router.get("/message", async (req, res) => {
    const messages = await Message.find({});
    res.send(messages);
});

router.post("/message", async (req, res) => {
    try {
        let message = new Message(req.body);
        await message.save();
        res.send(message);
        io.emit("newMessage", message);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
});

export default router;
