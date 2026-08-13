import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/dindex.js"
import {app} from "./app.js"
connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`App is listening at port ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("MongoDB connection Failed!!  ",error);
})
/*
import mongoose from "mongoose";
import {DB_NAME} from "./constant.js";
import express from "express";

const app = express();
( 
    async ()=>{
        try {
           const connectionVariable = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
            console.log(`MongoDB connected Succesfully!! DB Host:${connectionVariable.connection.host}`);
            app.listen(process.env.PORT,()=>{
                console.log(`App is listening at port ${process.env.PORT}`);
            })
        
        } catch (error) {
            console.log("MongoDB connection failed",error);
        }
    }
)();*/