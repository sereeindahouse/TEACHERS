const express = require("express");
const router = express.Router();
const {
  getPosts,
  createPost,
  getPost,
  deletePost,
  updatePost,
} = require("./controller/post-controller");
const { createUser, loginUser, getUser, getUsers } = require("./controller/user-controller");
const upload = require("./middleware/upload");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

router
  .get("/", (req, res) => {
    res.status(200).json({ message: "alive" });
  })
  .post("/signup", createUser)
  .post("/login", loginUser)
  .get("/users", getUsers)
  .get("/users/:id", authMiddleware, getUser)
  .get("/posts", authMiddleware, getPosts)
  .post("/posts", authMiddleware, createPost)
  .get("/posts/:id", authMiddleware, getPost)
  .patch("/posts/:id", authMiddleware, updatePost)
  .delete("/posts/:id", authMiddleware, deletePost)
  .post("/upload", authMiddleware, (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        console.error("Upload error:", err.message);
        return res.status(400).json({ message: err.message });
      }
      if (!req.file) return res.status(400).json({ message: "No image uploaded" });
      const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
      console.log("Image saved at:", imageUrl);
      res.status(200).json({ message: "Image uploaded", imageUrl });
    });
  });

module.exports = router;