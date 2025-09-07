import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { deleteComment, editComment, likeComment,getMyComments } from "../controllers/comment.controller";
import { isCommentAuthor } from "../middleware/isCommentAuthor";
const router = express.Router();

router.put("/:id",isCommentAuthor,editComment);
router.delete("/:id",isCommentAuthor,deleteComment);
router.post("/:id/like",authMiddleware,likeComment);
router.post("/:id/unlike",authMiddleware,likeComment);
router.get("/my", authMiddleware, getMyComments);



export default router;