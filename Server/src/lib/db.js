import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
    try {
        // mongodb connection string
        // console.log("This is mongodb_URI",process.env.MONGO_URI)

        // connect to mongodb
        const conn= await mongoose.connect(process.env.MONGO_URI)
        console.log(`mongodb connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`mongodb connection error: ${error}`);
    }
}