import mongoose from "mongoose";

const userschema=new mongoose.Schema({

    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    profilePic : {
        type : String,
        default : ""
    },
    bio : {
        type : String,
    }
},{timestamps :true});

export default mongoose.model("users",userschema);