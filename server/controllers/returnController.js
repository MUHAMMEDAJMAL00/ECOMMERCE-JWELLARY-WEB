const Return = require("../models/Return");

// Create new return request
const createReturn = async (req, res) => {
  try {
    const newReturn = new Return(req.body);
    await newReturn.save();
    res.status(201).json({
      message: "Return request created successfully",
      data: newReturn,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating return request", error: error.message });
  }
};

// Get all return requests
const getReturns = async (req, res) => {
  try {
    const returns = await Return.find();
    res.status(200).json(returns);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching return requests",
      error: error.message,
    });
  }
};

module.exports = { createReturn, getReturns };
