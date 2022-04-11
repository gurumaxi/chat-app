import express from "express";
import { Chat } from "./models/Chat";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello World");
});

router.post("/chats", async (req, res) => {
    try {
        var chat = new Chat(req.body);
        await chat.save();
        res.sendStatus(200);
        io.emit("chat", req.body);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
});

router.get("/chats", (req, res) => {
    Chat.find({}, (error, chats) => res.send(chats));
});

export default router;
