import bcrypt from "bcryptjs";
import User from "../models/User.js";
import sendToken from "../utils/sendToken.js";

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, password } = req.body;
    const exists = await User.findOne({ $or: [{ email }, { mobileNumber }] });
    if (exists) return res.status(400).json({ message: "Email or mobile already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, mobileNumber, password: hashed });

    sendToken(user, res);
    res.json({ message: "Account created", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({ $or: [{ email: identifier }, { mobileNumber: identifier }] });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    sendToken(user, res);
    res.json({ message: "Login success", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET AUTHENTICATED USER
export const getMe = (req, res) => res.json(req.user);

// LOGOUT
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { identifier, newPassword } = req.body;
    const user = await User.findOne({ $or: [{ email: identifier }, { mobileNumber: identifier }] });
    if (!user) return res.status(400).json({ message: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ✅ Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.json({
      success: true,
      users,
    });
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};