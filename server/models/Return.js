const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: [true, "Order ID is required"],
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ✅ Must match your actual User model name
    required: [true, "User ID is required"],
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // ✅ Optional: links the return to a specific product
    required: [true, "Product ID is required"],
  },
  reason: {
    type: String,
    required: [true, "Reason for return is required"],
    trim: true,
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
