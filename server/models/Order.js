const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      name: { type: String, required: true },
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  address: {
    location: String, // 🔍 Search Location field
    addressType: { type: String }, // 🏠 Home / Office
    flat: String, // 🏢 Flat/Room
    fullAddress: { type: String, required: true }, // 📬 Full written address
    poBox: String, // 📦 PO Box
    street: String, // 🛣️ Street
    city: String,
    state: String,
    name: String,
    country: String,
    phone: { type: String, required: true },
    paymentMethod: { type: String, required: true },
  },
  totalPrice: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Processing",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
