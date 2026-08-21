// Imports
import User from "../models/User.js"
import bcrypt from "bcryptjs"

import { generateToken } from "../lib/utils.js";

export const register = async (req,res)=>{
    const {username , email,password,firstName,lastName,role} = req.body;
    try {
        if(!username || !email || !password || !firstName || !lastName || !role) {
            return res.status(400).json({message : "Fill all the fields"});
        }
        // check for the min password length
        if(password.length < 6) {
            return res.status(400).json({message : "Password can't be less than 6 characthers"});
        }
        // check for the Email ID it it exist already or not
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message : "User already exists with this email ID"});
        }

        // check usename is unique
        const isUsernameUnique = await User.findOne({username})
        if(isUsernameUnique){
            return res.status(400).json({message : "Username already taken"})
        }

        // check for the valid role
        const validRoles = ['student', 'instructor'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        // new User object
        const newUser = new User({
            username : username,
            email : email,
            password:password,
            firstName: firstName,
            lastName: lastName, 
            role: role
        });
        

        // validate the newuser
        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();

            // add this newUser to the response
            res.status(201).json({
                _id : newUser._id,
                username : newUser.username,
                email : newUser.email,
                role : newUser.role,
                firstName : newUser.firstName,
                lastName : newUser.lastName,                
            });

            console.log("new user created with Email : ",email)
            
        }
        else{
            res.status(400).json({message : "Invalid user data"});
        }

    } catch (error) {
        console.log("error in signup controller :",error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const login=async (req,res)=>{
    // taking email and password from the user
    const { email, password } = req.body;

    try{
        // getting the user with email id 'email'
        const user = await User.findOne({ email });

        // user doesnt exist
        if (!user){
            return res.status(400).json({message: "Invalid Credentials "});
        }

        // If user exists check for passwd
        const isPasswordCorrect = await user.comparePassword(password);

        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid Credentials"});
        }
        // if everything is correct generate JWT
        generateToken(user._id, res)

        // details send back to the client
        res.status(200).json({
            _id : user._id,
            username : user.username,
            email : user.email,
            role : user.role,
            firstName : user.firstName,
            lastName : user.lastName,
               
        })

    } catch (error){
        console.log("Error in login controller", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

export const logout=(req,res)=>{
    try{
        // deleting the cookie by setting its age as 0ms
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error){
        console.log("Error in login controller", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const checkAuth = (req, res) =>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};