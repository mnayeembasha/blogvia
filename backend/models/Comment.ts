import mongoose from "mongoose";
import {z} from "zod";
interface CommentDocument extends mongoose.Document {
    content: string;
    blogId: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    likes: mongoose.Schema.Types.ObjectId[];
    noOfLikes: number;
}

const commentSchema = new mongoose.Schema<CommentDocument>({
    content: {
        type: String,
        required: true
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    noOfLikes:{
        type: Number,
        default:0
    },

},{
    timestamps: true
});

export const Comment = mongoose.model<CommentDocument>("Comment", commentSchema);


const commentLikeSchema = new mongoose.Schema({
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
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
export const CommentLike = mongoose.model("CommentLike", commentLikeSchema);