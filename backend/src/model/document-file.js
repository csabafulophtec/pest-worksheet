const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DocumentFile", fileSchema);
