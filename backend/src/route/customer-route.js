// src/routes.js
const express = require("express");
const multer = require("multer");
const Customer = require("../model/customer");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const DocumentFile = require("../model/document-file");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const pathToSave = "uploads/";
    cb(null, pathToSave);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Create a new customer
router.post("/customers", async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).send(customer);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Read all customers
router.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.send(customers);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Read a customer by ID
router.get("/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).send();
    }
    res.send(customer);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a customer by ID
router.patch("/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!customer) {
      return res.status(404).send();
    }
    res.send(customer);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a customer by ID
router.delete("/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).send();
    }
    res.send(customer);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/customers/search/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const customers = await Customer.find({ name: new RegExp(name, "i") }); // 'i' for case-insensitive search
    if (customers.length === 0) {
      return res
        .status(404)
        .send({ message: "No customers found with that name" });
    }
    res.send(customers);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to handle file uploads for a customer
router.post("/customers/:id/files", upload.single("file"), async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).send({ message: "Customer not found" });
    }

    const { fileName, docBase64String } = req.body;
    if (!fileName || !docBase64String) {
      return res.status(400).send({ message: "Missing file data" });
    }

    // Decode the Base64 string
    const base64Data = docBase64String.replace(
      `data:application/pdf;filename=${fileName};base64,`,
      ""
    );
    const filePath = path.join(__dirname, "../../uploads", fileName);
    fs.writeFileSync(filePath, base64Data, "base64");

    // Save file details to the database
    const file = new DocumentFile({
      filename: req.body.fileName,
      path: `uploads/${req.body.fileName}`,
      customer: customer._id,
      uploadDate: new Date(),
    });

    await file.save();
    res.send({ message: "File uploaded successfully", file });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to get all files for a customer
router.get("/customers/:id/files", async (req, res) => {
  try {
    const files = await DocumentFile.find({ customer: req.params.id });
    if (!files) {
      return res
        .status(404)
        .send({ message: "No files found for this customer" });
    }
    res.send(files);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to delete a specific file for a customer
router.delete("/customers/:id/files/:fileId", async (req, res) => {
  try {
    const file = await DocumentFile.findByIdAndDelete(req.params.fileId);
    if (!file) {
      return res.status(404).send({ message: "File not found" });
    }
    res.send({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
