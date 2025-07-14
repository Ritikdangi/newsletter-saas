 import jwt from "jsonwebtoken";
import {verifyToken} from "../services/jwtService.js";
 export const authenticateUser = async (req ,res , next)=>{
      const token = req.headers.authorization.split(" ")[1];
      if(!token){
        return res.status(401).json({ message: "Unauthorized" });
      }
      try{
        const decoded = verifyToken(token);
    //   console.log(decoded)
        req.user = decoded;
        next();
      }
      catch(error){
        return res.status(401).json({ message: "Invalid token" });
      }

 }