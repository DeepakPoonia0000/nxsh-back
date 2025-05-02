import mongoose from "mongoose";
import { MONGODB_URI } from "../config/env.js";
console.log("This is the mongo d b uri => ", process.env.MONGODB_URI)

const conn = async () => {
    try {
        const connect = await mongoose.connect(MONGODB_URI)
        console.log("DB Connected", MONGODB_URI);
    } catch (err) {
        console.error("DB connection error:", err);
        process.exit(1);
    }
};

export default conn;
