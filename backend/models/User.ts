import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
    fullName: string;
    username:string;
    email: string;
    profilePic:string;
    password: string;
    bio: string;
    followers: mongoose.Schema.Types.ObjectId[];
    following: mongoose.Schema.Types.ObjectId[];
};


const userSchema = new mongoose.Schema<UserDocument>({
    fullName:{
        type: String,
        required: true
    },
    username:{
        type:String,
        required:true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default:""
    },
    profilePic:{
        type: String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    followers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
},{
    timestamps:true
});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){ //If password isn't modified(User may be updating some other fields) then dont generate the hash
        return next();
    }
    try{
        this.password = await bcrypt.hash(this.password,10);
        next();
    }catch(error:any){
        next(error);
    }
  });

export const User = mongoose.model<UserDocument>("User", userSchema);