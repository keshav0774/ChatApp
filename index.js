import express from 'express';
import dns from 'dns';
import dotenv from "dotenv"
import connectToMongoDb from './config/database.js';
dns.setServers(['8.8.8.8','8.8.4.4'])


dotenv.config();
const app = express();
app.use(express.json());

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

