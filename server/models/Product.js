const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: String,
  image: String,
  stock: String,
  stocks: String,
  metalPurity: String,
  weight: String,
  availableToOrder: { type: Boolean, default: true },
  aed: String,
  rating: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  isTopProduct: {
    type: Boolean,
    default: false,
  },
  isTrending: {
    type: Boolean,
    default: false,
  },
  masterCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MasterCategory",
  },
});

const newProduct = mongoose.model("Product", productSchema);

module.exports = newProduct;
