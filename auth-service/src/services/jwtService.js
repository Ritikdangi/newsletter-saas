import jwt from "jsonwebtoken";
export const generateToken = (payload) => {
 
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7h" });
    return token;
}

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
  };