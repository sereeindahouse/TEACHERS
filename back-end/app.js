require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const route = require("./src/route");
const path = require("path");
const cors = require("cors");

app.use(express.json()); 
app.use(cors({ origin: "http://localhost:3000" })); 
app.use("/", route); 

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGODB_URI, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("Database connected to:", process.env.MONGODB_URI);
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
    process.exit(1);
  });

console.log("JWT_SECRET:", process.env.JWT_SECRET);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}`);
});

module.exports = app;