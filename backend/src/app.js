import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import router from "./routes";

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
    console.log("connected to socket");
    socket.emit("hello", "world");

    socket.on("howdy", arg => {
        console.log(arg);
    });
});

const server = app.listen(8000, () => {
    console.log(`App listening on port ${server.address().port}`);
});

app.use("/", router);
