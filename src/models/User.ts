import mongoose, { Schema } from "mongoose";

const placeSchema = new Schema({
    name: { type: String, required: true },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true }
});

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skillLevel: { type: String, required: true },
    favoritePlaces : [placeSchema],
});

export const User = mongoose.model('User', userSchema);