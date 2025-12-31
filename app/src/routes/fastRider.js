import express from "express";
import {
    getAttractions,
    bookTicket,
    getMyTicket,
    cancelTicket
} from "../controllers/fastRider.js";
import {authenticate} from "../utils/authMiddleware.js";

const router = express.Router();

// List all attractions that support FastRider
router.get("/attractions", authenticate, getAttractions);

// Book nearest available FastRider ticket
router.post("/book", authenticate, bookTicket);

// Get user's active FastRider ticket
router.get("/my-ticket/:userId", authenticate, getMyTicket);

// Cancel active FastRider ticket
router.post("/cancel", authenticate, cancelTicket);

export default router;
