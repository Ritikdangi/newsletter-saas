import express from "express";
import { hashPassword ,comparePassword} from "../services/hashService.js";
import { generateToken } from "../services/jwtService.js";
import prisma from "../prisma/client.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, tenantName } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create tenant
    const tenant = await prisma.tenant.create({ data: { name: tenantName } });

    // Create user
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, tenantId: tenant.id }
    });

    // Generate JWT token
    const token = generateToken({ userId: user.id, tenantId: tenant.id });

    return res.json({ success: true, token });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req,res) =>{

    try{
         const { email , password} = req.body;
         const user = await prisma.user.findUnique({ where: { email } });
         if(!user){
            return res.status(401).json({ message: "Invalid credentials" });
         } 
          
         const isPasswordValid = await comparePassword(password, user.password);
         if(!isPasswordValid){
            return res.status(401).json({ message: "Invalid credentials" });
         }
         const token = generateToken({ userId: user.id, tenantId: user.tenantId });
         return res.json({ success: true, token });
    }
    catch(error){
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const me = async (req,res)=>{ 
    // console.log("userId type:", typeof req.user.userId, "value:", req.user.userId);
     try{
        const user = await prisma.user.findUnique({where : { id : req.user.userId} ,
            include: { tenant: true }
        })
    
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
         
      return res.json({
            success : true, 
            user : {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                tenant: user.tenant.name,
            }
         });
     }
     catch(error){
        res.status(500).json({ message: "Server error in /me" , error });
     }

  }