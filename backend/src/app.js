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
const dbString = "mongodb://mongo_db:27017";
mongoose.connect(dbString, { useNewUrlParser: true, user: "root", pass: "1234" });
mongoose.connection.once("open", () => console.log("connected successfully to mongodb"));

// socket io
const io = new Server(8001, { cors: { origin: "http://localhost:3000" } });
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
