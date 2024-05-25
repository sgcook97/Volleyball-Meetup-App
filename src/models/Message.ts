import mongoose, { Schema, Document } from "mongoose";

interface IMessage extends Document {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
}

const messageSchema: Schema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '7d' },
});

export const Message = mongoose.model<IMessage>('Message', messageSchema);