import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import contactRequestRoutes from "./routes/contactRequestRoutes.js";


dotenv.config();
const app = express();

// ---------------- CONFIG ----------------
app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// ---------------- MONGO ----------------
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
  }
};

connectDB();

// ---------------- ROUTES ----------------
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/contact-requests", contactRequestRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

// ---------------- START SERVER ----------------
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

export default app; // 👈 VERY IMPORTANT