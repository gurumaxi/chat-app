import mongoose from "mongoose";

export const Message = mongoose.model("Message", {
    name: String,
    message: String
});
