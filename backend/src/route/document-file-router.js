// src/router/customer-router.js
const express = require("express");
const path = require("path");

const router = express.Router();

/**
 * Route to serve the PDF file
 */
router.get("/files/:fileName", (req, res) => {
  const filePath = path.join(__dirname, "../../uploads", req.params.fileName);
  res.sendFile(filePath);
});

module.exports = router;
