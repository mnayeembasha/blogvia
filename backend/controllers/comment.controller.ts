import { type Request, type Response } from "express";
import { Comment, CommentLike } from "../models/Comment";
import { Blog } from "../models/Blog";
import mongoose from "mongoose";

export const getComments = async (req: Request, res: Response) => {
    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(blogId as string)) {
        return res.status(400).json({ message: "Invalid blog ID" });
    }

    try {
        const comments = await Comment.find({ blogId })
            .populate("userId", "-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Comments fetched successfully",
            comments
        });
    } catch (error) {
        console.error("Error in getComments controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const postComment = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const { content } = req.body;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(blogId as string)) {
        return res.status(400).json({ message: "Invalid blog ID" });
    }

    if (!content || content.trim().length === 0) {
        return res.status(400).json({ message: "Content is required" });
    }

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const newComment = await Comment.create({
            content,
            blogId,
            userId
        });

        const populatedComment = await Comment.findById(newComment._id)
            .populate("userId", "-password");

        return res.status(201).json({
            message: "Comment posted successfully",
            comment: populatedComment
        });
    } catch (error) {
        console.error("Error in postComment controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const editComment = async (req: Request, res: Response) => {
    const commentId = req.params.id;
    const { content } = req.body;
    const userId = req.user?._id as string;

    if (!mongoose.Types.ObjectId.isValid(commentId as string)) {
        return res.status(400).json({ message: "Invalid comment ID" });
    }

    if (!content || content.trim().length === 0) {
        return res.status(400).json({ message: "Content is required" });
    }

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized - You can only edit your own comments" });
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { content },
            { new: true }
        ).populate("userId", "-password");

        return res.status(200).json({
            message: "Comment updated successfully",
            comment: updatedComment
        });
    } catch (error) {
        console.error("Error in editComment controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    const commentId = req.params.id;
    const userId = req.user?._id as string;

    if (!mongoose.Types.ObjectId.isValid(commentId as string)) {
        return res.status(400).json({ message: "Invalid comment ID" });
    }

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized - You can only delete your own comments" });
        }

        await Comment.findByIdAndDelete(commentId);
        await CommentLike.deleteMany({ commentId });

        return res.status(200).json({
            message: "Comment deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteComment controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const likeComment = async (req: Request, res: Response) => {
    const commentId = req.params.id;
    const userId = req.user?._id as string;

    if (!mongoose.Types.ObjectId.isValid(commentId as string)) {
        return res.status(400).json({ message: "Invalid comment ID" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const comment = await Comment.findById(commentId).session(session);
        if (!comment) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Comment not found" });
        }

        const existingLike = await CommentLike.findOne({ commentId, userId }).session(session);
        if (existingLike) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Comment already liked" });
        }

        await CommentLike.create([{ commentId, userId }], { session });
        await Comment.updateOne(
            { _id: commentId },
            { $inc: { noOfLikes: 1 } },
            { session }
        );

        await session.commitTransaction();
        return res.status(200).json({ message: "Comment liked successfully" });
    } catch (error) {
        await session.abortTransaction();
        console.error("Error in likeComment controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        session.endSession();
    }
};

export const unlikeComment = async (req: Request, res: Response) => {
    const commentId = req.params.id;
    const userId = req.user?._id as string;

    if (!mongoose.Types.ObjectId.isValid(commentId as string)) {
        return res.status(400).json({ message: "Invalid comment ID" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const comment = await Comment.findById(commentId).session(session);
        if (!comment) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Comment not found" });
        }

        const existingLike = await CommentLike.findOneAndDelete({ commentId, userId }).session(session);
        if (!existingLike) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Comment not liked yet" });
        }

        await Comment.updateOne(
            { _id: commentId },
            { $inc: { noOfLikes: -1 } },
            { session }
        );

        await session.commitTransaction();
        return res.status(200).json({ message: "Comment unliked successfully" });
    } catch (error) {
        await session.abortTransaction();
        console.error("Error in unlikeComment controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        session.endSession();
    }
};

// Check if a user has liked a comment
export const checkCommentLikeStatus = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const comment = await CommentLike.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // const isLiked = comment.likes.includes(new Schema.Types.ObjectId(userId));
    const isLiked = comment.userId.toString() ===  userId;

    return res.status(200).json({ isLiked });
  } catch (error) {
    console.error('Error checking comment like status:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getMyComments = async (req: Request, res: Response) => {
    try {
        const blogs = await Blog.find({ author: req.user?._id }).select("_id");
        const blogIds = blogs.map(b => b._id);

        const comments = await Comment.find({ blogId: { $in: blogIds } })
            .populate("userId", "-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "My Comments Fetched Successfully",
            comments
        });
    } catch (error) {
        console.error("Error in getMyComments controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
