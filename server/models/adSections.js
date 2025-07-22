const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  text: {
    type: String,
  },
});
const adSection = mongoose.model("adSection", adSchema);
module.exports = adSection;
