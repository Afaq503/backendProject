// require('dotenv').config({path:"./env"})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
  // path: "./env" this is worng
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongo db connectionfailed !!! ", err);
  });

/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from 'express'
const app = express()

( async() => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("Error", (error) => {
            console.log("Error", error);
            throw error
        })

        app.listen(process.env.PORT,() => {
            console.log(`App is runing on Port: ${process.env.PORT}`);
        })


    } catch (error) {
        console.error("ERROR: ", error);
        throw error
    }
})()
*/
