const mongoose = require("mongoose");

const Topmodel = new mongoose.Schema({
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
});

const Topmodels = mongoose.model("topmodels", Topmodel);
module.exports = Topmodels;
