import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: String,
    typing: Boolean
});

export const User = mongoose.model("User", UserSchema);
