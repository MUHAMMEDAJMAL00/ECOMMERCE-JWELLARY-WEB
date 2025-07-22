const mongoose = require("mongoose");

const Trendingg = new mongoose.Schema({
  image: {
    type: String,
  },
  title: {
    type: String,
  },
  stock: {
    type: String,
  },
  stocks: {
    type: String,
  },
  aed: {
    type: String,
  },
  rating: {
    type: String,
  },
});

const Trending = mongoose.model("trends", Trendingg);
module.exports = Trending;
