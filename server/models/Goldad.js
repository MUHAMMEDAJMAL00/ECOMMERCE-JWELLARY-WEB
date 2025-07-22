const mongoose = require("mongoose");

const Sectiongold = new mongoose.Schema({
  image: {
    type: String,
  },
  text: {
    type: String,
  },
  description: {
    type: String,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // assumes you have a Category model
  },
});
const Goldad = mongoose.model("Goldad", Sectiongold);
module.exports = Goldad;
