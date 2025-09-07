import { type Request, type Response } from "express";
import { User } from "../models/User";
import { Blog } from "../models/Blog";
import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary";

export const fetchProfileWithBlogs = async (req: Request, res: Response) => {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId as string)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const blogs = await Blog.find({ author: userId, status: "published" })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Profile Fetched Successfully",
            user,
            blogs
        });
    } catch (error) {
        console.error("Error in fetchProfileWithBlogs controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// export const updateUser = async (req: Request, res: Response) => {
//     const { bio, profilePic } = req.body;
//     const userId = req.params.id;
//     const currentUserId = req.user?._id as string;

//     if (!mongoose.Types.ObjectId.isValid(userId as string)) {
//         return res.status(400).json({ message: "Invalid user ID" });
//     }

//     if (userId !== currentUserId.toString()) {
//         return res.status(403).json({ message: "Unauthorized - You can only update your own profile" });
//     }

//     try {
//         const updatedUser = await User.findByIdAndUpdate(
//             userId,
//             { bio, profilePic },
//             { new: true }
//         ).select("-password");

//         if (!updatedUser) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         return res.status(200).json({
//             message: "User updated successfully",
//             user: updatedUser
//         });
//     } catch (error) {
//         console.error("Error in updateUser controller", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

export const followUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const followerId = req.user?._id as string;

    if (!mongoose.Types.ObjectId.isValid(userId as string)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    if (userId === followerId.toString()) {
        return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(userId).session(session);
        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({ message: "User not found" });
        }

        const follower = await User.findById(followerId).session(session);
        if (!follower) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Follower not found" });
        }

        if (user.followers.includes(followerId as any)) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Already following this user" });
        }

        await User.updateOne(
            { _id: userId },
            { $push: { followers: followerId } },
            { session }
        );

        await User.updateOne(
            { _id: followerId },
            { $push: { following: userId } },
            { session }
        );

        await session.commitTransaction();
        return res.status(200).json({ message: "User followed successfully" });
    } catch (error) {
        await session.abortTransaction();
        console.error("Error in followUser controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        session.endSession();
    }
};

export const unfollowUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const followerId = req.user?._id as string;

    if (!mongoose.Types.ObjectId.isValid(userId as string)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    if (userId === followerId.toString()) {
        return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(userId).session(session);
        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({ message: "User not found" });
        }

        const follower = await User.findById(followerId).session(session);
        if (!follower) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Follower not found" });
        }

        if (!user.followers.includes(followerId as any)) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Not following this user" });
        }

        await User.updateOne(
            { _id: userId },
            { $pull: { followers: followerId } },
            { session }
        );

        await User.updateOne(
            { _id: followerId },
            { $pull: { following: userId } },
            { session }
        );

        await session.commitTransaction();
        return res.status(200).json({ message: "User unfollowed successfully" });
    } catch (error) {
        await session.abortTransaction();
        console.error("Error in unfollowUser controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        session.endSession();
    }
};

export const getFollowers = async (req: Request, res: Response) => {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId as string)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        const user = await User.findById(userId)
            .populate("followers", "-password")
            .select("followers");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Followers fetched successfully",
            followers: user.followers
        });
    } catch (error) {
        console.error("Error in getFollowers controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getFollowingList = async (req: Request, res: Response) => {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId as string)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        const user = await User.findById(userId)
            .populate("following", "-password")
            .select("following");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Following fetched successfully",
            following: user.following
        });
    } catch (error) {
        console.error("Error in getFollowingList controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};






export const updateUser = async (req: Request, res: Response) => {
    let { bio, profilePic } = req.body;
    const userId = req.params.id;
    const currentUserId = req.user?._id as string;

    if (!mongoose.Types.ObjectId.isValid(userId as string)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    if (userId !== currentUserId.toString()) {
        return res.status(403).json({ message: "Unauthorized - You can only update your own profile" });
    }

    try {
        let imageUrl = profilePic;
        if (profilePic && profilePic.startsWith('data:image/')) {
            // Extract base64 data
            const base64Data = profilePic.split(';base64,').pop() || '';
            const buffer = Buffer.from(base64Data, 'base64');

            // Check image size (5MB limit)
            if (buffer.length > 5 * 1024 * 1024) {
                return res.status(400).json({ message: 'Image size exceeds 5MB' });
            }

            // Upload to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(profilePic, {
                resource_type: 'image',
                folder: 'blogvia',
            });
            imageUrl = uploadResult.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { bio, profilePic: imageUrl },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error in updateUser controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};