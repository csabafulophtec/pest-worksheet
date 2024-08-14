// src/router/customer-router.js
const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

/**
 * Route to serve the PDF file
 */
router.get("/files/:fileName", (req, res) => {
  const filePath = path.join(__dirname, "../../uploads", req.params.fileName);
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).send({ message: "File not found" });
    }
    res.sendFile(filePath);
  });
});

module.exports = router;
