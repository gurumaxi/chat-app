import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { Server } from "socket.io";
import router from "./routes";

export const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// db config
const dbString = "mongodb://mongo_db:27017";
mongoose.connect(dbString, { useNewUrlParser: true });
mongoose.connection.once("open", () => console.log("connected successfully to mongodb"));

// socket io
const io = new Server(8001);
io.on("connection", socket => {
    console.log("connected to socket");
    socket.emit("hello", "world");

    socket.on("hi", arg => {
        console.log(arg);
    });
});

const server = app.listen(8000, () => {
    console.log(`App listening on port ${server.address().port}`);
});

app.use("/", router);
