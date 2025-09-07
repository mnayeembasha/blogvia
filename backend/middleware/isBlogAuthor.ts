import { type Request, type Response, type NextFunction } from "express";
import { Blog } from "../models/Blog";
import mongoose from "mongoose";

export const isBlogAuthor = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id as string;
    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(blogId as string)) {
        return res.status(400).json({ message: "Invalid blog ID" });
    }

    try {
        const blog = await Blog.findById(blogId).select("author");
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        if (userId.toString() !== blog.author.toString()) {
            return res.status(403).json({ message: "Unauthorized - User is not the author of the blog" });
        }

        next();
    } catch (error) {
        console.error("Error in isBlogAuthor middleware", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};