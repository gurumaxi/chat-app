import mongoose from "mongoose";

export const Chat = mongoose.model("Chat", {
    name: String,
    chat: String
});
