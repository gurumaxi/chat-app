import express from "express";
import { io } from "./app";
import { Message } from "./models/Message";
import { User } from "./models/User";

const router = express.Router();

router.get("/user", async (req, res) => {
    const allUsers = await User.find({});
    res.send(allUsers);
});

router.post("/user", async (req, res) => {
    const _id = req.body.userId;
    const userData = { username: req.body.username, typing: false };
    let user;
    if (_id) {
        user = await User.findOneAndUpdate({ _id }, userData, { new: true });
    } else {
        user = await User.create(userData);
    }
    res.send(user);
    io.emit("userChanged", user);
});

router.get("/message", async (req, res) => {
    const messages = await Message.find({});
    res.send(messages);
});

router.post("/message", async (req, res) => {
    let message = new Message(req.body);
    await message.save();
    res.send(message);
    io.emit("newMessage", message);
});

router.put("/fade-message", async (req, res) => {
    Message.findOneAndUpdate({ userId: req.body.userId }, { fade: true }, { sort: { _id: -1 }, new: true }, (_, message) => {
        res.sendStatus(200);
        if (message) io.emit("messageChanged", message);
    });
});

router.delete("/message/:userId", async (req, res) => {
    Message.findOneAndDelete({ userId: req.params.userId }, { sort: { _id: -1 } }, (_, message) => {
        res.sendStatus(200);
        if (message) io.emit("messageRemoved", message);
    });
});

export default router;
