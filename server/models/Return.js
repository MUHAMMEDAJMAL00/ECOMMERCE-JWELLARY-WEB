const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({
  orderId: { type: String, required: true }, // Reference to the order
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  reason: { type: String, required: true },
  status: { type: String, default: "Pending" }, // Pending, Approved, Rejected
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Return", returnSchema);
