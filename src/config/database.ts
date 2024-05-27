import mongoose from "mongoose";

const connectDB = async () => {
    const MONGODB_URI: string = process.env.MONGODB_URI as string;
    
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to the database');
    } catch (err) {
        console.error('Connection error', err);
        process.exit(1);
    }
};
  
export default connectDB;