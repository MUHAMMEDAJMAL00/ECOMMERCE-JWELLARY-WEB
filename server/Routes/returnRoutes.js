import express from "express";
import { createReturn, getReturns } from "../controllers/returnController";

const router = express.Router();

// POST request - create a return request
router.post("/", createReturn);

// GET request - get all return requests
router.get("/", getReturns);

export default router;
