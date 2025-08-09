const Return = require("../models/Return");

// Create a new return request
const createReturn = async (req, res) => {
  try {
    console.log("📥 Incoming return request body:", req.body);

    const { orderId, userId, productId, reason } = req.body;

    // ✅ Validate required fields
    if (!orderId || !userId || !productId || !reason) {
      return res.status(400).json({
        message: "orderId, userId, productId, and reason are required",
      });
    }

    // ✅ Validate ObjectId format for userId & productId
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }
    if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
      return res.status(400).json({ message: "Invalid productId format" });
    }

    // ✅ Create and save return
    const newReturn = new Return({
      orderId,
      userId,
      productId,
      reason,
    });

    await newReturn.save();

    res.status(201).json({
      message: "✅ Return request created successfully",
      data: newReturn,
    });
  } catch (error) {
    console.error("❌ Error creating return request:", error);
    res.status(500).json({
      message: "Error creating return request",
      error: error.message,
    });
  }
};

// Get all return requests
const getReturns = async (req, res) => {
  try {
    const returns = await Return.find()
      .populate("userId", "name email")
      .populate("productId", "name price image");

    res.status(200).json(returns);
  } catch (error) {
    console.error("❌ Error fetching return requests:", error);
    res.status(500).json({
      message: "Error fetching return requests",
      error: error.message,
    });
  }
};

module.exports = { createReturn, getReturns };
