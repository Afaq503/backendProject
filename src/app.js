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

import userRouter from './routers/user.routes.js'
import healthcheckRouter from './routers/healthcheck.routes.js'
import tweetRouter from './routers/tweet.routes.js'
import subscriptionRouter from "./routers/subscripition.routes.js"
import videoRouter from "./routers/video.routes.js"
import commentRouter from "./routers/comment.routes.js"
import likeRouter from "./routers/like.routes.js"
import playlistRouter from "./routers/playlist.routes.js"
import dashboardRouter from "./routers/dashboard.routes.js"

//  routes declaration

app.use("/api/v1/user",userRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)

export { app }