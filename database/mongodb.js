import mongoose from "mongoose";
import { MONGO_URI, NODE_ENV } from "../config/env.js";

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined inside .env<development/production>.local");
}

const connectDB = async () => {
    try {
        
        await mongoose.connect(MONGO_URI);

        console.log(`Connected to MongoDB in ${NODE_ENV} mode`);
    } catch (error) {
        console.error("Error connecting to database: ", error);
    }
}

export default connectDB; 