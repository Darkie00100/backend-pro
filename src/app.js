import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser()); // 👈 I MISSING THIS so the cookie were saying undefined while logout and causing unauthorized request

//import Router
import userRouter from "./routes/user.routes.js"

// Router declaration
app.use("/user",userRouter);
// http://localhost:3000/user/register
export {app};