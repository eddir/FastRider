import express from "express";
import {confirmCode, loginUser, registerUser} from "../controllers/userController.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("FastRider API is running");
});
router.post("/register", registerUser);
router.post("/confirm", confirmCode);
router.post("/login", loginUser);

export default router;
