import mongoose from "mongoose";
import {z} from "zod";
import { DEFAULT_BLOG_IMAGE } from "../config";

export interface BlogDocument extends mongoose.Document {
    title: string;
    content: string;
    slug:string;
    image: string;
    author: mongoose.Schema.Types.ObjectId;
    status: string;
    category:string;
    tags:string[],
    publishedAt: Date;
    likes: mongoose.Schema.Types.ObjectId[];
    noOfLikes: number;
}

const blogSchema = new mongoose.Schema<BlogDocument>({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default:DEFAULT_BLOG_IMAGE
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    slug:{
        type: String,
        unique: true
    },
    status:{
        type:String,
        enum:['draft', 'published','unpublished'], //v2- archived,scheduled
        default:'draft'
    },
    publishedAt:{ //when blog went live - useful for sorting,scheduling,SEO
        type:Date,
        default:null
    },
    noOfLikes:{
        type: Number,
        default:0
    },
    // ["general","technology","lifestyle","business","Health","Education"]
    category:{
        type:String,
        default:"general"
    },
    tags:{
        type:[String],
        default:[]
    },


    //v2{views:{type:Number,default:0}}

},{
    timestamps: true
});

export const Blog = mongoose.model<BlogDocument>("Blog", blogSchema);

const blogLikeSchema = new mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{
    timestamps: true
});
export const BlogLike = mongoose.model("BlogLike", blogLikeSchema);