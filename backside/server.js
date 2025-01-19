require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// ... other imports
const socketServer = require("./socketServer");

const app = express();

const corsOptions = {
    origin: "http://localhost:3000", // Your frontend origin
    credentials: true,
};

app.use(cors(corsOptions)); // Use cors with options
app.use(express.json());
app.use(cookieParser());

// ... routes

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: corsOptions, // Use the same CORS options for Socket.IO
    transports: ['polling', 'websocket']
});

io.on('connection', socket => {
    console.log("Socket.IO connected"); // Very important log!
    socketServer(socket);
});

// ... database connection and server start (as before)
const port = process.env.PORT || 5000;
const URL = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected...");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

connectDB();

http.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
