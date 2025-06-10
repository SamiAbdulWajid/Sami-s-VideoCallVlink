import express from "express";
import {createServer} from "node:http";
import {Server} from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/users.routes.js";


const app=express();
const server=createServer(app);
const io=connectToSocket(server);


app.set("port",(process.env.PORT || 8000))
app.use(cors());
app.use(express.json({limit :"40kb"}));
app.use(express.urlencoded({limit:"40kb",extended : true}));



app.get("/home",(req,res)=>{
    return res.json({"hello":"world"})
});

app.use("/api/v1/users",userRoutes);

const start=async ()=>{
    const connectionDB=await mongoose.connect("mongodb+srv://samiabdulwajid:sami051203@cluster0.gdh5ct0.mongodb.net/");

    console.log(`MONGO Connected DB Host : ${connectionDB.connection.host}`)
    server.listen(app.get("port"), '0.0.0.0', () => {
     console.log("Listening on port 8000")
});
   
}

start();