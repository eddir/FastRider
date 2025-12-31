import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

export const comparePasswords = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

// Secret key (keep this in an environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export const generateToken = (payload) => {
    // payload can include { userId, email } or any info you want in the token
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }); // token expires in 1 hour
};