const mongoose = require("mongoose");

const MasterCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

const MasterCategory = mongoose.model("MasterCategory", MasterCategorySchema);
module.exports = MasterCategory;
