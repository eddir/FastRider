import {generateToken, hashPassword, comparePasswords} from "../utils/auth.js";
import prisma from "../utils/prismaClient.js";

export const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Проверяем, существует ли уже пользователь с таким email
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        const hashed = await hashPassword(password);

        // Generate 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Expire in 5 minutes
        const codeExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await prisma.user.create({
            data: {
                email,
                password: hashed,
                verificationCode,
                codeExpiresAt,
            },
        });

        console.log(`Verification code for ${email}: ${verificationCode}`);

        res.json({ message: "User registered. Check server log for verification code." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const confirmCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid email or verification code" });
        }

        // Check if code matches and is not expired
        if (user.verificationCode !== code) {
            return res.status(400).json({ error: "Invalid email or verification code" });
        }

        if (new Date() > user.codeExpiresAt) {
            return res.status(400).json({ error: "Verification code has expired" });
        }

        // Mark user as verified and clear code
        await prisma.user.update({
            where: { email },
            data: {
                isVerified: true,
                verificationCode: null,
                codeExpiresAt: null,
            },
        });

        res.json({ message: "Email verified successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Check password
        const isValid = await comparePasswords(password, user.password);
        if (!isValid) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Optional: check if user has verified their code (if needed)
        // if (!user.isVerified) {
        //     return res.status(400).json({ error: "Please verify your email first" });
        // }

        // Generate JWT token
        const token = generateToken({ userId: user.id, email: user.email });

        res.json({ message: "Login successful", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};
