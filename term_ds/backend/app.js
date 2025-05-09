import mongoose from "mongoose";
import express from "express";
import authRoutes from "./routes/auth.js";
import process from "process";

const app = express();
app.use(express.json());

// Підключення до MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);

app.listen(4000, () =>
  console.log("🚀 Server running on http://localhost:4000"),
);
