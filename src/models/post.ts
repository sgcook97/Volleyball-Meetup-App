import mongoose, { Schema } from "mongoose";

// const placeSchema = new Schema({
//     name: { type: String, required: true },
//     longitude: { type: Number, required: true },
//     latitude: { type: Number, required: true },
// });

const postSchema = new Schema({
    poster: { 
        posterId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
        username: { type: String, required: true }
    },
    location: { type: String, required: true },
    skillLevel: { type: String, required: true },
    content: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export const Post = mongoose.model('Post', postSchema);