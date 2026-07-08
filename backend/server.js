import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import http from 'http'
import { connectDB } from './LIB/db.js'
const PORT = process.env.PORT || 5000
dotenv.config()

const app = express()
const server = http.createServer(app);
//middleware setup

app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api/status",(req,res) => {
    res.status(200).json({ message: "Status check successful" });
});

await connectDB();
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

