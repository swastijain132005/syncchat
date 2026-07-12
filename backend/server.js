import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import http from 'http'
import { connectDB } from './LIB/db.js'
import morgan from 'morgan'
import userRouter from './routes/user.routes.js'
import messageRouter from './routes/message.routes.js'
import {Server} from "socket.io"
const PORT = process.env.PORT || 5000
dotenv.config()

const app = express()
const server = http.createServer(app);


export const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

//store online users 
export const usersocketmap={};//userid : socketid

//socket.io connection handler 

io.on("connection", (socket) => {
    console.log("a user connected");
    const userId = socket.handshake.query.userId;
    if (!userId) {
        console.error("User ID is missing");
        return;
    }
    usersocketmap[userId] = socket.id;
    //emit online user to all connected clients
    io.emit("getonlineUsers", Object.keys(usersocketmap));
    socket.on("disconnect", () => {
        console.log("user disconnected");
        delete usersocketmap[userId];
            io.emit("getonlineUsers", Object.keys(usersocketmap));

    });
});
//middleware setup
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);


app.use("/api/status",(req,res) => {
    res.status(200).json({ message: "Status check successful" });
});

await connectDB();
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

