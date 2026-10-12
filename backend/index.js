
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToMongoDb from "./config/database.js";
import redisClient from "./config/redis.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/msg", messageRouter);

const Port = 8000;

const startServer = async () => {
  try {
    await connectToMongoDb();
    await redisClient.connect();

    app.listen(Port, () => {
      console.log(`Server is Running on port number ${Port}`);
    });
  } catch (err) {
    console.log("Error:", err.message);
  }
};

startServer();
