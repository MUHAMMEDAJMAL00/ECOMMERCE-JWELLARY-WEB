const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: String,
  addressType: { type: String, enum: ["Home", "Office"], default: "Home" },
  flat: String,
  poBox: String,
  name: String,
  street: String,
  city: String,
  state: String,
  country: String,
  phone: { type: String, required: true },
  fullAddress: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
