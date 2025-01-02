const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require("morgan");

dotenv.config();

const app = express();

// CORS configuration to allow all origins for development purposes
const corsOptions = {
  origin: 'http://localhost:5173',  // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,  
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));  // Apply CORS middleware with the updated configuration
app.use(express.json());      // Parse JSON request body
app.use(cookieParser());      // Parse cookies
app.use(morgan("dev"));       // Logging middleware

// Connect to MongoDB
connectDB();

// Routes
const authRoutes = require('./routes/authRoute');
const postRoutes = require('./routes/postRoute');
const commentRoutes = require('./routes/commentRoute');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);




module.exports = app;
