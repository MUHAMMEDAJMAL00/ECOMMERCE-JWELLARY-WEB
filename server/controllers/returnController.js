const Return = require("../models/Return");

// Create a new return request
const createReturn = async (req, res) => {
  try {
    console.log("📥 Incoming return request body:", req.body);

    const { orderId, userId, productId, reason, description } = req.body;

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
      description, // save description too
      status: "Pending", // default status
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

// ✅ Update return status (Admin action)
const updateReturnStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedReturn = await Return.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("userId", "name email")
      .populate("productId", "name price image");

    if (!updatedReturn) {
      return res.status(404).json({ message: "Return request not found" });
    }

    res.json({
      message: "✅ Return status updated successfully",
      data: updatedReturn,
    });
  } catch (error) {
    console.error("❌ Error updating return status:", error);
    res.status(500).json({
      message: "Error updating return status",
      error: error.message,
    });
  }
};

module.exports = { createReturn, getReturns, updateReturnStatus };
