const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: [true, "Order ID is required"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Ensure your User model is named 'User'
    required: [true, "User ID is required"],
  },
  reason: {
    type: String,
    required: [true, "Reason for return is required"],
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Return", returnSchema);
