import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protectRoute= async(req,res,next)=>{
    try {
        
        const token = req.cookies.jwt;
        
        // if token is not present send 401 status
        if(!token){
            return res.status(401).json({message: "Unauthorized- no token provided"});
        }

        // verify the token
        const decoded= jwt.verify(token,process.env.JWT_SECRET)

        // if token is invalid or expired send 401 status 
        if(!decoded){
            return res.status(401).json({message: "Unauthorized- invalid token"});
        }

        const user= await User.findById(decoded.userId).select("-password"); // excluding password

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        req.user=user;
        
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}