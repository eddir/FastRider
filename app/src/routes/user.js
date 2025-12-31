import express from "express";
import { registerUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("FastRider API is running");
});
router.post("/register", registerUser);

export default router;
