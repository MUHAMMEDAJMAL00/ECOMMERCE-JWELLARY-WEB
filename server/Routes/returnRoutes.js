const express = require("express");
const { createReturn, getReturns } = require("../controllers/returnController");

const router = express.Router();

// POST request - create a return request
router.post("/", createReturn);

// GET request - get all return requests
router.get("/", getReturns);

module.exports = router;
