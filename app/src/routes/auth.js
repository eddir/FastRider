import express from "express";
import rateLimit from "express-rate-limit";
import { confirmCode, loginUser, registerUser } from "../controllers/userController.js";

const router = express.Router();

// Rate limiter configuration
const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        status: 429,
        message: "Too many requests, please try again later."
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,   // Disable the `X-RateLimit-*` headers
});

// Routes
router.get("/", (req, res) => {
    res.send("FastRider API is running");
});

// Apply rate limiter to auth routes
router.post("/register", authLimiter, registerUser);
router.post("/confirm", authLimiter, confirmCode);
router.post("/login", authLimiter, loginUser);

export default router;
