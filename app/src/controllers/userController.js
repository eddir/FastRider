import { hashPassword } from "../utils/auth.js";

export const registerUser = async (req, res) => {
    const { email, password } = req.body;
    const hashed = await hashPassword(password);
    // Save to database via Prisma (we’ll add models later)
    res.json({ email, password: hashed });
};
