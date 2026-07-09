import bcrypt from 'bcrypt'
import usermodel from '../model/user.model.js'
import { generateToken } from '../LIB/utils.js'
import cloudinary from '../LIB/cloudinary.js'

export const signup=async(req,res)=>{
        const {email,password,name,bio}=req.body;
        try{
            const existingUser=await usermodel.findOne({email});
            if(existingUser){
                return res.status(400).json({message:"User already exists"});
            }
            const hashedPassword=await bcrypt.hash(password,10);

        const newUser=await usermodel.create({email,password:hashedPassword,name,bio});

            const token=generateToken(newUser._id);
            res.status(200).json({message:"User created successfully",token,user:newUser});
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

    export const checkAuth = (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
};


// Controller to update user profile details
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;

        const userId = req.user._id;
        let updatedUser;

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { bio, fullName },
                { new: true }
            );
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    profilePic: upload.secure_url,
                    bio,
                    fullName,
                },
                { new: true }
            );
        }

        res.json({
            success: true,
            user: updatedUser,
        });

    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};