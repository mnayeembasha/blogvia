import { type Request, type Response, type NextFunction } from "express";
import { Comment } from "../models/Comment";
import mongoose from "mongoose";

export const isCommentAuthor = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id as string;
    const commentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(commentId as string)) {
        return res.status(400).json({ message: "Invalid comment ID" });
    }

    try {
        const comment = await Comment.findById(commentId).select("userId");
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (userId.toString() !== comment.userId.toString()) {
            return res.status(403).json({ message: "Unauthorized - User is not the author of the comment" });
        }

        next();
    } catch (error) {
        console.error("Error in isCommentAuthor middleware", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};