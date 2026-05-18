
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


// import express from "express";
// const app= express();

const connectDB = async ()=>{
    try {
        const connnectionInstance= await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n MONGODB CONNECTED !! DB HOST: ${connnectionInstance.connection.host} `)
    } catch (error) {
        console.log("MONGODB Connection Error", error)
        process.exit(1)
    }
}

export default connectDB;