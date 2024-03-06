import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit: "16kb"})) // form sy data aya
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//  routes import 
//            sageregation

import userRouter from './routers/user.routers.js'

//  routes declaration

app.use("/api/v1/user",userRouter)

export { app }