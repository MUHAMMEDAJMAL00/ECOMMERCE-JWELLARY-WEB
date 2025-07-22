const mongoose = require("mongoose");

const goldPriceSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    gold24: { type: Number, required: true },
    gold22: { type: Number, required: true },
    gold21: { type: Number, required: true },
    gold18: { type: Number, required: true },
    silver: { type: Number, required: true },
  },
  { timestamps: true }
);
const GoldPrice = mongoose.model("GoldPrice", goldPriceSchema);

module.exports = GoldPrice;
