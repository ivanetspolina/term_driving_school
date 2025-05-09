import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import process from "process";

const router = express.Router();

// Регістрація
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const user = new User({ name, email, passwordHash });
  await user.save();
  res.status(201).json({ message: "Користувача створено" });
});

// Логін
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Невірні дані" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Невірні дані" });

  // Створюємо JWT
  const payload = { id: user._id, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ accessToken: token });
});

export default router;
