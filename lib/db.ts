// import mongoose from "mongoose";

// let isConnected = false;

// export async function connectDB() {

//     if(isConnected) {
//         console.log("MongoDB is already connected");
//         return;
//     }

//     if(!process.env.MONGO_URI) {
//         throw new Error("MONGO_URI is not defined in environment variables");
//     }

//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         isConnected = true;
//         console.log("MongoDB connected successfully");
//     } catch (error) {
//         console.error("MongoDB connection error:", error);
//         throw error;
//     }
// }


import mongoose from "mongoose";

export async function connectDB() {
    const readyState = mongoose.connection.readyState;

    if (readyState === 1) {
        console.log("MongoDB is already connected");
        return;
    }

    if (readyState === 2) {
        await mongoose.connection.asPromise();
        return;
    }

    if(!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined in environment variables");
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}