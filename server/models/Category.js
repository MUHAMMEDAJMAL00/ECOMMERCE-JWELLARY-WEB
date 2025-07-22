const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  masterCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MasterCategory",
    required: true,
  },
});

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
