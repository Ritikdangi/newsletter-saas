import jwt from "jsonwebtoken";
export const generateToken = (userId) => {
    const payload = { userId };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7h" });
    return token;
}