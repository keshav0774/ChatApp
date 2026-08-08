import express from 'express';
import dotenv from "dotenv"
import connectToMongoDb from './config/database.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import dns from 'dns';
dns.setServers(['8.8.8.8','8.8.4.4'])


dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/user',userRouter);
const Port = 3000;

const startServer = async ()=>{
    
    try {
         await connectToMongoDb();
        app.listen(Port ,()=>{
        console.log(`Server is Running on port number ${Port}`);
    })
    } catch (err) {
        console.log('Error:', err.message);
    }
}

startServer();