const express = require("express");
const router = express.Router();
const Category = require("../server/models/Category");
const Product = require("../server/models/Product");
const { verifyToken, isAdmin } = require("../server/middleware/Auth");

// Add Category
router.post("/category", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ error: "Category name is required" });

    const existing = await Category.findOne({ name });
    if (existing)
      return res.status(409).json({ error: "Category already exists" });

    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: "Failed to create category" });
  }
});

// Add Product
router.post("/product", verifyToken, isAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

module.exports = router;
