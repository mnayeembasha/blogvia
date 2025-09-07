
import express from "express";
import { zodValidate } from "../middleware/zodValidate";
import { blogCreateZodSchema} from "../validate/zodSchema";
import { authMiddleware } from "../middleware/authMiddleware";
import {
    createBlog,
    deleteBlog,
    editBlog,
    getBlogs,
    getSpecificBlogById,
    getSpecificBlogBySlug,
    likeBlog,
    publishBlog,
    unlikeBlog,
    unPublishBlog,
    getBlogsWithFilters,
    getBlogBySlugAndAuthor,
    checkBlogLikeStatus,
    getMyBlogs
} from "../controllers/blog.controller";
import { isBlogAuthor } from "../middleware/isBlogAuthor";
import { getComments, postComment } from "../controllers/comment.controller";

const router = express.Router();

// Blog CRUD operations
router.post("/", zodValidate(blogCreateZodSchema), authMiddleware, createBlog);
router.get("/filter", getBlogsWithFilters);
router.get("/", getBlogs);
router.get("/my", authMiddleware, getMyBlogs);
router.get("/:id", getSpecificBlogById);
router.get("/slug/:slug", getSpecificBlogBySlug);
router.put("/:id", zodValidate(blogCreateZodSchema), authMiddleware, isBlogAuthor, editBlog);
router.delete("/:id", authMiddleware, isBlogAuthor, deleteBlog);

// Blog status operations
router.put("/:id/publish", authMiddleware, isBlogAuthor, publishBlog);
router.put("/:id/unpublish", authMiddleware, isBlogAuthor, unPublishBlog);

// Blog interaction operations
router.post("/:id/like", authMiddleware, likeBlog);
router.post("/:id/unlike", authMiddleware, unlikeBlog);
router.get("/:id/like-status", authMiddleware, checkBlogLikeStatus);

// Comment operations
router.post("/:id/comments", authMiddleware, postComment);
router.get("/:id/comments", getComments);
router.get("/:username/:slug", getBlogBySlugAndAuthor);




export default router;