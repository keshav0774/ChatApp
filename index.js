import express from 'express';
import dns from 'dns';
import dotenv from "dotenv"
dns.setServers(['8.8.8.8','8.8.4.4'])

const app = express();
app.use(express.json());


app.listen(3000,()=>{
    console.log("server is running on port numver")
})

