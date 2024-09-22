import mongoose from 'mongoose'

const company=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:
    {
        type:String
    },
    website:{
        type:String
    },
    location:{
        type:String,
        required:true
    },
    logo:{
        type:String,
        
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:True,
    }



},{timestamps:true});