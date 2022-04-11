import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        userId: Number,
        text: String
    },
    { timestamps: true }
);

export const Message = mongoose.model("Message", MessageSchema);
