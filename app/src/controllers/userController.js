import {generateToken, hashPassword, comparePasswords} from "../utils/auth.js";
import prisma from "../utils/prismaClient.js";

export const registerUser = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { phoneNumber },
        });

        if (existingUser) {
            return res.status(400).json({ error: "User with this phone number already exists" });
        }

        const hashed = await hashPassword(password);

        // Generate 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Expire in 5 minutes
        const codeExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await prisma.user.create({
            data: {
                phoneNumber,
                password: hashed,
                verificationCode,
                codeExpiresAt,
            },
        });

        console.log(`Verification code for ${phoneNumber}: ${verificationCode}`);

        res.json({ message: "User registered. Check server log for verification code." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const confirmCode = async (req, res) => {
    try {
        const { phoneNumber, code } = req.body;

        const user = await prisma.user.findUnique({
            where: { phoneNumber },
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid phone number or verification code" });
        }

        // Check if code matches and is not expired
        if (user.verificationCode !== code) {
            return res.status(400).json({ error: "Invalid phone number or verification code" });
        }

        if (new Date() > user.codeExpiresAt) {
            return res.status(400).json({ error: "Verification code has expired" });
        }

        // Mark user as verified and clear code
        await prisma.user.update({
            where: { phoneNumber },
            data: {
                isVerified: true,
                verificationCode: null,
                codeExpiresAt: null,
            },
        });

        res.json({ message: "phoneNumber verified successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;

        // Find user by phoneNumber
        const user = await prisma.user.findUnique({
            where: { phoneNumber },
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid phone number or password" });
        }

        // Check password
        const isValid = await comparePasswords(password, user.password);
        if (!isValid) {
            return res.status(400).json({ error: "Invalid phone number or password" });
        }

        // Optional: check if user has verified their code (if needed)
        if (!user.isVerified) {
            return res.status(400).json({ error: "Please verify your phone number first" });
        }

        // Generate JWT token
        const token = generateToken({ userId: user.id, phoneNumber: user.phoneNumber });

        res.json({ message: "Login successful", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                phoneNumber: true,
                isVerified: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};