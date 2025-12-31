import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

export const comparePasswords = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

export const generateToken = (payload) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }); // token expires in 1 hour
};