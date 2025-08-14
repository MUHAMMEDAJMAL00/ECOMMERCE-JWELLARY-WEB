const express = require("express");
const { createReturn, getReturns } = require("../controllers/returnController");

const router = express.Router();

// POST — Create a return
router.post("/", createReturn);

// GET — Get all returns
router.get("/", getReturns);
router.put("/:id/status", updateReturnStatus);

module.exports = router;
