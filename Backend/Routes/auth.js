import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from '../Models/users.js';

const authrouter = express.Router();

// 🔹 REGISTER
authrouter.post("/register", async (req, res) => {
  const { username, password, phone, email, address, collectorType } = req.body;

  try {
    // 🧩 Check for missing fields
    if (!username || !password || !phone || !email || !address || !collectorType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔍 Check existing user
    const existingUser = await auth.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔒 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🆕 Create new user
    const newUser = new auth({
      username,
      password: hashedPassword,
      phone,
      email,
      address,
      collectorType,
      access:'denied'
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 LOGIN
authrouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await auth.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid username or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, ezxrdcfghbjklmsdfgjijkyvyuhbkuytrrss, { expiresIn: "2h" });
    res.json({ message: "Login successful", token ,data:user._id});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default authrouter;