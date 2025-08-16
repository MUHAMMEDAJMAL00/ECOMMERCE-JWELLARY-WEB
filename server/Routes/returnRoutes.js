const express = require("express");
const {
  createReturn,
  getReturns,
  updateReturnStatus,
} = require("../controllers/returnController");

const router = express.Router();

// POST — Create a return
router.post("/", createReturn);

// GET — Get all returns
router.get("/", getReturns);

// PUT — Update return status (Approved / Rejected)
router.put("/:id/status", updateReturnStatus);

module.exports = router;
