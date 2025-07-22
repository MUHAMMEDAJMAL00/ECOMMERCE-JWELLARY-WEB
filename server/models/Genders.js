const mongoose = require("mongoose");

const GenderSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  text: {
    type: String,
  },
});
const Gender = mongoose.model("Gender", GenderSchema);
module.exports = Gender;
