import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    nickname: String
});

export const User = mongoose.model("User", UserSchema);
