import express from "express";
import {confirmCode, registerUser} from "../controllers/userController.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("FastRider API is running");
});
router.post("/register", registerUser);
router.post("/confirm", confirmCode);

export default router;
