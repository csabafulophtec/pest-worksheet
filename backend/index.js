// src/app.js
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const customerRoutes = require("./src/route/customer-route");

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

// Use the customer routes
app.use(customerRoutes);

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://csabafulop:xp2EjR3SCaU4QV1H@pest.gtx0r.mongodb.net/?retryWrites=true&w=majority&appName=pest"
    );
    console.log("Connected to MongoDB");

    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

startServer();
