// server.js

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./api/foodRoute.js";
import userRouter from "./api/userRoute.js";
import cartRouter from "./api/cartRoute.js";
import orderRouter from "./api/orderRoute.js";
import contactRouter from "./api/contactRoute.js";
import 'dotenv/config'; // Load environment variables

// Create express app
const app = express();
const port = process.env.PORT || 4000; // Use the PORT from .env or default to 4000

// Middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/contact", contactRouter);

app.get("/", (req, res) => {
  res.send("API working");
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
