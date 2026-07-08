import bcrypt from 'bcrypt'
import usermodel from '../model/user.model.js'
import { generateToken } from '../LIB/utils.js'

export const signup=async(req,res)=>{
        const {email,password,name,bio}=req.body;
        try{
            const existingUser=await usermodel.findOne({email});
            if(existingUser){
                return res.status(400).json({message:"User already exists"});
            }
            const hashedPassword=await bcrypt.hash(password,10);

        const newUser=await usermodel.create({email,password:hashedPassword,name,bio});
    
            res.status(201).json({message:"User created successfully",user:newUser});

            const token=generateToken(newUser._id);
            res.status(200).json({message:"User created successfully",token});
        }
        catch(error){
            console.log(error.message);
            res.status(500).json({message:"Server error"});

        }

    }

    export const login=async(req,res)=>{
        const {email,password}=req.body;
        try{
            const user=await usermodel.findOne({email});
            if(!user){
                return res.status(400).json({message:"User not found"});
            }
            const isMatch=await bcrypt.compare(password,user.password);
            if(!isMatch){
                return res.status(400).json({message:"Invalid credentials"});
            }
            const token=generateToken(user._id);
            res.status(200).json({message:"Login successful",token});

        }
        catch(error){
            console.log(error.message);
            res.status(500).json({message:"Server error"});

        }
    }