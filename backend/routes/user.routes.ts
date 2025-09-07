import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { fetchProfileWithBlogs, followUser, getFollowers, getFollowingList, updateUser } from "../controllers/user.controller";
const router = express.Router();

router.get("/:id",authMiddleware,fetchProfileWithBlogs);
router.put("/:id",authMiddleware,updateUser);
router.post("/:id/follow",authMiddleware,followUser);
router.get("/:id/followers",authMiddleware,getFollowers);
router.get("/:id/following",authMiddleware,getFollowingList);


export default router;