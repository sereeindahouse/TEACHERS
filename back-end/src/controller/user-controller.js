const UserModel = require("../model/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: "Failed to fetch users", error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { userName, password, profileImage } = req.body;
    console.log("Received signup data:", { userName, hasPassword: !!password, profileImage });
    if (!userName || !password) {
      return res.status(400).json({ message: "userName and password are required" });
    }
    const existingUser = await UserModel.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password generated:", hashedPassword);
    const newUser = await UserModel.create({
      userName,
      password: hashedPassword,
      profileImage: profileImage || "https://example.com/default.jpg",
    });
    console.log("User saved to DB:", newUser._id.toString(), "with userName:", newUser.userName);
    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    console.error("Create user error:", err.message, "Stack:", err.stack);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Username already exists" });
    }
    res.status(400).json({ message: "Failed to create user", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    console.log("Login attempt for:", userName, "with password provided:", !!password);
    const user = await UserModel.findOne({ userName });
    if (!user) {
      console.log("User not found for:", userName);
      return res.status(401).json({ message: "User not found" });
    }
    console.log("User found:", user._id, "comparing password");
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch, "for user:", user._id);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Login successful, token generated for userId:", user._id.toString());
    res.status(200).json({ message: "Login successful", token, userId: user._id.toString() });
  } catch (err) {
    console.error("Login error:", err.message, "Stack:", err.stack);
    res.status(400).json({ message: "Login failed", error: err.message });
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: "Failed to fetch user", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete user", error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: "Failed to update user", error: err.message });
  }
};