import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import router from "./routes";
import { User } from "./models/User";

export const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// db config
mongoose.connect("mongodb://mongo_db:27017", {
    useNewUrlParser: true,
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD
});

// socket io
export const io = new Server(8001, { cors: { origin: "http://localhost:3000" } });
io.on("connection", socket => {
    socket.on("typing", async args => {
        await User.findOneAndUpdate({ _id: args.userId }, { typing: args.typing });
        io.emit("userChanged");
    });

    socket.on("countdown", args => {
        io.emit("countdown", args);
    });
});

const server = app.listen(8000, () => {
    console.log(`App listening on port ${server.address().port}`);
});

app.use("/", router);
