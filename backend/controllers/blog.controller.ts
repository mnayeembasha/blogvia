import { type Request, type Response } from "express";
import { Blog, type BlogDocument } from "../models/Blog";
import { BlogLike } from "../models/Blog";
import { generateBlogSlug } from "../utils/sluggify";
import { DEFAULT_BLOG_IMAGE } from "../config";
import { type FilterQuery, type SortOrder } from 'mongoose';
import mongoose from "mongoose";
import type { UserDocument } from "../models/User";
import cloudinary from "../lib/cloudinary";

export const getBlogs = async (req: Request, res: Response) => {
    try {
        const blogs = await Blog.find({ status: "published" })
            .populate("author", "-password")
            .sort({ publishedAt: -1 });

        return res.status(200).json({
            message: "Blogs Fetched Successfully",
            blogs
        });
    } catch (error) {
        console.error("Error in getBlogs controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getSpecificBlogById = async (req: Request, res: Response) => {
    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(blogId as string)) {
        return res.status(400).json({ message: "Invalid blog ID" });
    }

    try {
        const blog = await Blog.findOne({ _id: blogId, status: "published" })
            .populate("author", "-password");

        if (!blog) {
            return res.status(404).json({ message: "Blog Not Found" });
        }

        return res.status(200).json({
            message: "Blog Fetched Successfully",
            blog
        });
    } catch (error) {
        console.error("Error in getSpecificBlogById controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getSpecificBlogBySlug = async (req: Request, res: Response) => {
    const blogSlug = req.params.slug;

    try {
        const blog = await Blog.findOne({ slug: blogSlug, status: "published" })
            .populate("author", "-password");

        if (!blog) {
            return res.status(404).json({ message: "Blog Not Found" });
        }

        return res.status(200).json({
            message: "Blog Fetched Successfully",
            blog
        });
    } catch (error) {
        console.error("Error in getSpecificBlogBySlug controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const createBlog = async (req: Request, res: Response) => {
    const { title, content, category, tags } = req.body;
    let image = req.body.image as string | undefined;

    try {
      // Handle image upload if provided as base64
      let imageUrl = DEFAULT_BLOG_IMAGE;
      if (image && image.startsWith('data:image/')) {
        // Extract base64 data
        const base64Data = image.split(';base64,').pop() || '';
        const buffer = Buffer.from(base64Data, 'base64');

        // Check image size (5MB limit)
        if (buffer.length > 5 * 1024 * 1024) {
          return res.status(400).json({ message: 'Image size exceeds 5MB' });
        }

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(image, {
          resource_type: 'image',
          folder: 'blogvia',
        });
        imageUrl = uploadResult.secure_url;
      }

      const slug = generateBlogSlug(title);

      const blogData: Partial<BlogDocument> = {
        title,
        content,
        image: imageUrl,
        author: req.user?._id as mongoose.Schema.Types.ObjectId,
        slug,
      };

      // Add category if provided
      if (category) {
        blogData.category = category;
      }

      // Add tags if provided
      if (tags && Array.isArray(tags)) {
        blogData.tags = tags;
      }

      const newBlog = await Blog.create(blogData);

      return res.status(201).json({
        message: 'Blog created successfully',
        blog: newBlog,
      });
    } catch (error) {
      console.error('Error in createBlog controller', error);

      if ((error as any).code === 11000) {
        return res.status(400).json({ message: 'Blog with this title already exists' });
      }

      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

export const publishBlog = async (req: Request, res: Response) => {
    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(blogId as string)) {
        return res.status(400).json({ message: "Invalid blog ID" });
    }

    try {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        if (blog.status === "published") {
            return res.status(400).json({ message: "Blog already published" });
        }

        await Blog.updateOne(
            { _id: blogId },
            {
                $set: {
                    status: "published",
                    publishedAt: new Date()
                }
            }
        );

        return res.status(200).json({ message: "Blog published successfully" });
    } catch (error) {
        console.error("Error in publishBlog controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const unPublishBlog = async (req: Request, res: Response) => {
    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(blogId as string)) {
        return res.status(400).json({ message: "Invalid blog ID" });
    }

    try {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        if (blog.status === "unpublished") {
            return res.status(400).json({ message: "Blog already unpublished" });
        }

        await Blog.updateOne(
            { _id: blogId },
            { $set: { status: "unpublished" } }
        );

        return res.status(200).json({ message: "Blog unpublished successfully" });
    } catch (error) {
        console.error("Error in unPublishBlog controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const editBlog = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const { title, content, category, tags } = req.body;
    let image = req.body.image;

    if (!mongoose.Types.ObjectId.isValid(blogId as string)) {
        return res.status(400).json({ message: "Invalid blog ID" });
    }

    if (!image) {
        image = DEFAULT_BLOG_IMAGE;
    }

    const slug = generateBlogSlug(title);

    try {
        const updateData: any = {
            title,
            content,
            image,
            slug
        };

        // Add category if provided
        if (category) {
            updateData.category = category;
        }

        // Add tags if provided
        if (tags && Array.isArray(tags)) {
            updateData.tags = tags;
        }

        const blog = await Blog.findByIdAndUpdate(
            blogId,
            updateData,
            { new: true }
        ).populate("author", "-password");

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        return res.status(200).json({
            message: "Blog updated successfully",
            blog
        });
    } catch (error) {
        console.error("Error in editBlog controller", error);

        if ((error as any).code === 11000) {
            return res.status(400).json({ message: "Blog with this title already exists" });
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteBlog = async (req: Request, res: Response) => {
    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(blogId as string)) {
        return res.status(400).json({ message: "Invalid blog ID" });
    }

    try {
        const blog = await Blog.findByIdAndDelete(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Clean up related data
        await BlogLike.deleteMany({ blogId });

        return res.status(200).json({
            message: "Blog deleted successfully",
            blog
        });
    } catch (error) {
        console.error("Error in deleteBlog controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const likeBlog = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const userId = req.user?._id as string;

    if (!mongoose.Types.ObjectId.isValid(blogId as string)) {
        return res.status(400).json({ message: "Invalid blog ID" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const blog = await Blog.findById(blogId).session(session);
        if (!blog) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Blog not found" });
        }

        const existingLike = await BlogLike.findOne({ blogId, userId }).session(session);
        if (existingLike) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Blog already liked" });
        }

        await BlogLike.create([{ blogId, userId }], { session });
        await Blog.updateOne(
            { _id: blogId },
            { $inc: { noOfLikes: 1 } },
            { session }
        );

        await session.commitTransaction();
        return res.status(200).json({ message: "Blog liked successfully" });
    } catch (error) {
        await session.abortTransaction();
        console.error("Error in likeBlog controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        session.endSession();
    }
};

export const unlikeBlog = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const userId = req.user?._id as string;

    if (!mongoose.Types.ObjectId.isValid(blogId as string)) {
        return res.status(400).json({ message: "Invalid blog ID" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const blog = await Blog.findById(blogId).session(session);
        if (!blog) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Blog not found" });
        }

        const existingLike = await BlogLike.findOneAndDelete({ blogId, userId }).session(session);
        if (!existingLike) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Blog not liked yet" });
        }

        await Blog.updateOne(
            { _id: blogId },
            { $inc: { noOfLikes: -1 } },
            { session }
        );

        await session.commitTransaction();
        return res.status(200).json({ message: "Blog unliked successfully" });
    } catch (error) {
        await session.abortTransaction();
        console.error("Error in unlikeBlog controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        session.endSession();
    }
};

interface BlogQueryParams {
    search?: string;
    category?: string;
    sortBy?: 'publishedAt' | 'likes' | 'title';
    sortOrder?: 'asc' | 'desc';
    page?: string;
    limit?: string;
  }

  // Define interface for Blog filter (aligns with Blog schema)
  interface BlogFilter extends FilterQuery<BlogDocument> {
    status?: string;
    $or?: Array<{
      title?: { $regex: string; $options: string };
      content?: { $regex: string; $options: string };
      tags?: { $in: RegExp[] };
    }>;
    category?: string;
  }

  // Define interface for sort options
  interface SortOptions {
    [key: string]: SortOrder;
  }

  // Define response data structure
  interface BlogResponse {
    message: string;
    blogs: BlogDocument[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalBlogs: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }
export const getBlogsWithFilters = async (req: Request<{}, {}, {}, BlogQueryParams>, res: Response) => {
    try {
      const {
        search = '',
        category = '',
        sortBy = 'publishedAt',
        sortOrder = 'desc',
        page = '1',
        limit = '12',
      } = req.query;

      // Validate query parameters
      if (!['publishedAt', 'likes', 'title'].includes(sortBy)) {
        return res.status(400).json({ message: 'Invalid sortBy value' } as any);
      }
      if (!['asc', 'desc'].includes(sortOrder)) {
        return res.status(400).json({ message: 'Invalid sortOrder value' } as any);
      }

      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, parseInt(limit) || 12);

      // Build filter object
      const filter: BlogFilter = {};

      // Add search filter
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      // Add category filter
      if (category && category !== 'all') {
        filter.category = category;
      }

      // Log filter for debugging
      console.log('Filter:', filter);

      // Build sort object
      const sortOptions: SortOptions = {};
      if (sortBy === 'publishedAt') {
        sortOptions.publishedAt = sortOrder as SortOrder;
      } else if (sortBy === 'likes') {
        sortOptions.noOfLikes = sortOrder as SortOrder;
      } else if (sortBy === 'title') {
        sortOptions.title = sortOrder as SortOrder;
      }

      // Calculate pagination
      const skip = (pageNum - 1) * limitNum;

      // Get blogs with filters
      const blogs = await Blog.find(filter)
        .populate<{ author: UserDocument }>('author', '-password')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum);

      // Get total count for pagination
      const totalBlogs = await Blog.countDocuments(filter);
      console.log('Total Blogs:', totalBlogs); // Debug log

      const totalPages = Math.ceil(totalBlogs / limitNum);

      return res.status(200).json({
        message: 'Blogs fetched successfully',
        blogs,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalBlogs,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      });
    } catch (error) {
      console.error('Error in getBlogsWithFilters controller:', error instanceof Error ? error.message : error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

export const getBlogBySlugAndAuthor = async (req: Request, res: Response) => {
    const { username, slug } = req.params;
    console.log("inside getBlogBySlugAndAuthor controller")
    console.log("username = ",username);
    console.log("slug = ",slug);
    try {
        const blog = await Blog.findOne({ slug, status: "published" }).populate({
            path: "author",
            select: "-password",
            match: { username: username }
        });



        console.log("blog =",blog);

        if (!blog || !blog.author) {
            return res.status(404).json({ message: "Blog not found" });
        }

        return res.status(200).json({
            message: "Blog fetched successfully",
            blog
        });
    } catch (error) {
        console.error("Error in getBlogBySlugAndAuthor controller", error);

        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkBlogLikeStatus = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const userId = req.user?._id as string;

    if (!mongoose.Types.ObjectId.isValid(blogId as string)) {
        return res.status(400).json({ message: "Invalid blog ID" });
    }

    try {
        const existingLike = await BlogLike.findOne({ blogId, userId });

        return res.status(200).json({
            message: "Like status fetched successfully",
            isLiked: !!existingLike
        });
    } catch (error) {
        console.error("Error in checkBlogLikeStatus controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMyBlogs = async (req: Request, res: Response) => {
    try {
        const blogs = await Blog.find({ author: req.user?._id })
            .populate("author", "-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "My Blogs Fetched Successfully",
            blogs
        });
    } catch (error) {
        console.error("Error in getMyBlogs controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};