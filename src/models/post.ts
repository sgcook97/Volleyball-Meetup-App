import mongoose, { Schema } from "mongoose";

const placeSchema = new Schema({
    name: { type: String, required: true },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
});

const postSchema = new Schema({
    poster: { type: String, required: true },
    location: placeSchema,
    skillLevel: { type: String, required: true },
    content: { type: String },
});

export const Post = mongoose.model('Post', postSchema);