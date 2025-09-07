import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

export interface BlogType {
    _id: string;
    title: string;
    content: string;
    image: string;
    author: {
        _id: string;
        username: string;
        fullName:string;
        email: string;
        profilePic?: string;
    };
    slug: string;
    status: string;
    category: string;
    tags: string[];
    publishedAt: string;
    noOfLikes: number;
    createdAt: string;
    updatedAt: string;
}

export interface CommentType {
    _id: string;
    content: string;
    blogId: string;
    userId: {
        _id: string;
        username: string;
        fullName:string;
        email: string;
        profilePic?: string;
    };
    noOfLikes: number;
    createdAt: string;
    updatedAt: string;
}

export type ExtendedCommentType = CommentType & { isLiked: boolean };

export interface BlogFilters {
    search: string;
    category: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    page: number;
    limit: number;
}
export interface Pagination{
    currentPage: number;
    totalPages: number;
    totalBlogs: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface BlogState {
    blogs: BlogType[];
    currentBlog: BlogType | null;
    comments: ExtendedCommentType[];
    myBlogs: BlogType[];
    myComments: CommentType[];
    isLoading: boolean;
    isLoadingBlog: boolean;
    isLoadingComments: boolean;
    isLiking: boolean;
    isCommenting: boolean;
    isCreating: boolean;
    isPublishing: boolean;
    isLoadingMyBlogs: boolean;
    isLoadingMyComments: boolean;
    isEditingBlog: boolean;
    isDeletingBlog: boolean;
    filters: BlogFilters;
    pagination: Pagination;
    isLiked: boolean;
    isLikingComments: Record<string, boolean>;
}

export interface ApiError {
    message: string;
    status?: number;
}

const initialState: BlogState = {
    blogs: [],
    currentBlog: null,
    comments: [],
    myBlogs: [],
    myComments: [],
    isLoading: false,
    isLoadingBlog: false,
    isLoadingComments: false,
    isLiking: false,
    isCommenting: false,
    isCreating: false,
    isPublishing: false,
    isLoadingMyBlogs: false,
    isLoadingMyComments: false,
    isEditingBlog: false,
    isDeletingBlog: false,
    filters: {
        search: '',
        category: 'all',
        sortBy: 'publishedAt',
        sortOrder: 'desc',
        page: 1,
        limit: 12
    },
    pagination: {
        currentPage: 1,
        totalPages: 0,
        totalBlogs: 0,
        hasNextPage: false,
        hasPrevPage: false
    },
    isLiked: false,
    isLikingComments: {}
};

// Async thunks
export const fetchBlogsWithFilters = createAsyncThunk<
    { blogs: BlogType[]; pagination: Pagination },
    BlogFilters,
    { rejectValue: ApiError }
>(
    'blogs/fetchBlogsWithFilters',
    async (filters, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams({
                search: filters.search,
                category: filters.category,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
                page: filters.page.toString(),
                limit: filters.limit.toString()
            });

            const res = await axiosInstance.get(`/blogs/filter?${queryParams}`);
            return res.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue({
                    message: error.response?.data?.message || 'Failed to fetch blogs',
                    status: error.response?.status,
                });
            }
            return rejectWithValue({ message: 'Unknown error occurred' });
        }
    }
);

export const fetchBlogBySlugAndAuthor = createAsyncThunk<
    BlogType,
    { username: string; slug: string },
    { rejectValue: ApiError }
>(
    'blog/fetchBlogBySlugAndAuthor',
    async ({ username, slug }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/blogs/${username}/${slug}`);
            return res.data.blog;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue({
                    message: error.response?.data?.message || 'Blog not found',
                    status: error.response?.status,
                });
            }
            return rejectWithValue({ message: 'Unknown error occurred' });
        }
    }
);

export const fetchComments = createAsyncThunk<
    CommentType[],
    string,
    { rejectValue: ApiError }
>(
    'blog/fetchComments',
    async (blogId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/blogs/${blogId}/comments`);
            return res.data.comments;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue({
                    message: error.response?.data?.message || 'Failed to fetch comments',
                    status: error.response?.status,
                });
            }
            return rejectWithValue({ message: 'Unknown error occurred' });
        }
    }
);

export const likeBlog = createAsyncThunk<
    void,
    string,
    { rejectValue: ApiError }
>(
    'blog/likeBlog',
    async (blogId, { rejectWithValue }) => {
        try {
            await axiosInstance.post(`/blogs/${blogId}/like`);
            toast.success('Blog liked successfully');
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || 'Failed to like blog';
                toast.error(errorMessage);
                return rejectWithValue({
                    message: errorMessage,
                    status: error.response?.status,
                });
            }
            return rejectWithValue({ message: 'Unknown error occurred' });
        }
    }
);

export const unlikeBlog = createAsyncThunk<
    void,
    string,
    { rejectValue: ApiError }
>(
    'blog/unlikeBlog',
    async (blogId, { rejectWithValue }) => {
        try {
            await axiosInstance.post(`/blogs/${blogId}/unlike`);
            toast.success('Blog unliked successfully');
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || 'Failed to unlike blog';
                toast.error(errorMessage);
                return rejectWithValue({
                    message: errorMessage,
                    status: error.response?.status,
                });
            }
            return rejectWithValue({ message: 'Unknown error occurred' });
        }
    }
);

export const postComment = createAsyncThunk<
    CommentType,
    { blogId: string; content: string },
    { rejectValue: ApiError }
>(
    'blog/postComment',
    async ({ blogId, content }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/blogs/${blogId}/comments`, { content });
            toast.success('Comment posted successfully');
            return res.data.comment;
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || 'Failed to post comment';
                toast.error(errorMessage);
                return rejectWithValue({
                    message: errorMessage,
                    status: error.response?.status,
                });
            }
            return rejectWithValue({ message: 'Unknown error occurred' });
        }
    }
);

export const checkBlogLikeStatus = createAsyncThunk<
    boolean,
    string,
    { rejectValue: ApiError }
>(
    'blog/checkBlogLikeStatus',
    async (blogId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/blogs/${blogId}/like-status`);
            return res.data.isLiked;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue({
                    message: error.response?.data?.message || 'Failed to check like status',
                    status: error.response?.status,
                });
            }
            return rejectWithValue({ message: 'Unknown error occurred' });
        }
    }
);

export const createBlogThunk = createAsyncThunk<
  BlogType,
  { title: string; content: string; category: string; tags: string[]; image?: string },
  { rejectValue: ApiError }
>(
  'blog/createBlog',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/blogs', data);
      return res.data.blog;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Failed to create blog';
        toast.error(errorMessage);
        return rejectWithValue({
          message: errorMessage,
          status: error.response?.status,
        });
      }
      return rejectWithValue({ message: 'Unknown error occurred' });
    }
  }
);

export const publishBlogThunk = createAsyncThunk<
  void,
  string,
  { rejectValue: ApiError }
>(
  'blog/publishBlog',
  async (blogId, { rejectWithValue }) => {
    try {
      await axiosInstance.put(`/blogs/${blogId}/publish`);
      toast.success('Blog published successfully');
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Failed to publish blog';
        toast.error(errorMessage);
        return rejectWithValue({
          message: errorMessage,
          status: error.response?.status,
        });
      }
      return rejectWithValue({ message: 'Unknown error occurred' });
    }
  }
);

export const unPublishBlogThunk = createAsyncThunk<
  void,
  string,
  { rejectValue: ApiError }
>(
  'blog/unPublishBlog',
  async (blogId, { rejectWithValue }) => {
    try {
      await axiosInstance.put(`/blogs/${blogId}/unpublish`);
      toast.success('Blog unpublished successfully');
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Failed to unpublish blog';
        toast.error(errorMessage);
        return rejectWithValue({
          message: errorMessage,
          status: error.response?.status,
        });
      }
      return rejectWithValue({ message: 'Unknown error occurred' });
    }
  }
);

export const editBlogThunk = createAsyncThunk<
  BlogType,
  { id: string; data: { title: string; content: string; category: string; tags: string[]; image?: string } },
  { rejectValue: ApiError }
>(
  'blog/editBlog',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/blogs/${id}`, data);
      toast.success('Blog updated successfully');
      return res.data.blog;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Failed to edit blog';
        toast.error(errorMessage);
        return rejectWithValue({
          message: errorMessage,
          status: error.response?.status,
        });
      }
      return rejectWithValue({ message: 'Unknown error occurred' });
    }
  }
);

export const deleteBlogThunk = createAsyncThunk<
  void,
  string,
  { rejectValue: ApiError }
>(
  'blog/deleteBlog',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/blogs/${id}`);
      toast.success('Blog deleted successfully');
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Failed to delete blog';
        toast.error(errorMessage);
        return rejectWithValue({
          message: errorMessage,
          status: error.response?.status,
        });
      }
      return rejectWithValue({ message: 'Unknown error occurred' });
    }
  }
);

export const fetchMyBlogs = createAsyncThunk<
  BlogType[],
  void,
  { rejectValue: ApiError }
>(
  'blog/fetchMyBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/blogs/my');
      return res.data.blogs;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch my blogs';
        toast.error(errorMessage);
        return rejectWithValue({
          message: errorMessage,
          status: error.response?.status,
        });
      }
      return rejectWithValue({ message: 'Unknown error occurred' });
    }
  }
);

export const fetchMyComments = createAsyncThunk<
  CommentType[],
  void,
  { rejectValue: ApiError }
>(
  'blog/fetchMyComments',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/comments/my');
      return res.data.comments;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch my comments';
        toast.error(errorMessage);
        return rejectWithValue({
          message: errorMessage,
          status: error.response?.status,
        });
      }
      return rejectWithValue({ message: 'Unknown error occurred' });
    }
  }
);

export const checkCommentLikeStatus = createAsyncThunk<
    boolean,
    string,
    { rejectValue: ApiError }
>(
    'comment/checkCommentLikeStatus',
    async (commentId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/comments/${commentId}/like-status`);
            return res.data.isLiked;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue({
                    message: error.response?.data?.message || 'Failed to check comment like status',
                    status: error.response?.status,
                });
            }
            return rejectWithValue({ message: 'Unknown error occurred' });
        }
    }
);

export const likeComment = createAsyncThunk<
    void,
    string,
    { rejectValue: ApiError }
>(
    'comment/likeComment',
    async (commentId, { rejectWithValue }) => {
        try {
            await axiosInstance.post(`/comments/${commentId}/like`);
            toast.success('Comment liked successfully');
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || 'Failed to like comment';
                toast.error(errorMessage);
                return rejectWithValue({
                    message: errorMessage,
                    status: error.response?.status,
                });
            }
            return rejectWithValue({ message: 'Unknown error occurred' });
        }
    }
);

export const unlikeComment = createAsyncThunk<
    void,
    string,
    { rejectValue: ApiError }
>(
    'comment/unlikeComment',
    async (commentId, { rejectWithValue }) => {
        try {
            await axiosInstance.post(`/comments/${commentId}/unlike`);
            toast.success('Comment unliked successfully');
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || 'Failed to unlike comment';
                toast.error(errorMessage);
                return rejectWithValue({
                    message: errorMessage,
                    status: error.response?.status,
                });
            }
            return rejectWithValue({ message: 'Unknown error occurred' });
        }
    }
);

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Partial<BlogFilters>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentBlog: (state) => {
            state.currentBlog = null;
            state.comments = [];
            state.isLiked = false;
        },
        clearBlogs: (state) => {
            state.blogs = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Blogs with Filters
            .addCase(fetchBlogsWithFilters.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchBlogsWithFilters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.blogs = action.payload.blogs;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchBlogsWithFilters.rejected, (state) => {
                state.isLoading = false;
            })
            // Fetch Blog by Slug and Author
            .addCase(fetchBlogBySlugAndAuthor.pending, (state) => {
                state.isLoadingBlog = true;
            })
            .addCase(fetchBlogBySlugAndAuthor.fulfilled, (state, action) => {
                state.isLoadingBlog = false;
                state.currentBlog = action.payload;
            })
            .addCase(fetchBlogBySlugAndAuthor.rejected, (state) => {
                state.isLoadingBlog = false;
                state.currentBlog = null;
            })
            // Fetch Comments
            .addCase(fetchComments.pending, (state) => {
                state.isLoadingComments = true;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.isLoadingComments = false;
                state.comments = action.payload.map((c) => ({ ...c, isLiked: false }));
            })
            .addCase(fetchComments.rejected, (state) => {
                state.isLoadingComments = false;
            })
            // Like Blog
            .addCase(likeBlog.pending, (state) => {
                state.isLiking = true;
            })
            .addCase(likeBlog.fulfilled, (state) => {
                state.isLiking = false;
                state.isLiked = true;
                if (state.currentBlog) {
                    state.currentBlog.noOfLikes += 1;
                }
            })
            .addCase(likeBlog.rejected, (state) => {
                state.isLiking = false;
            })
            // Unlike Blog
            .addCase(unlikeBlog.pending, (state) => {
                state.isLiking = true;
            })
            .addCase(unlikeBlog.fulfilled, (state) => {
                state.isLiking = false;
                state.isLiked = false;
                if (state.currentBlog) {
                    state.currentBlog.noOfLikes -= 1;
                }
            })
            .addCase(unlikeBlog.rejected, (state) => {
                state.isLiking = false;
            })
            // Post Comment
            .addCase(postComment.pending, (state) => {
                state.isCommenting = true;
            })
            .addCase(postComment.fulfilled, (state, action) => {
                state.isCommenting = false;
                state.comments.unshift({ ...action.payload, isLiked: false });
            })
            .addCase(postComment.rejected, (state) => {
                state.isCommenting = false;
            })
            // Check Blog Like Status
            .addCase(checkBlogLikeStatus.fulfilled, (state, action) => {
                state.isLiked = action.payload;
            })
            // Create Blog
            .addCase(createBlogThunk.pending, (state) => {
                state.isCreating = true;
            })
            .addCase(createBlogThunk.fulfilled, (state) => {
                state.isCreating = false;
                toast.success('Blog saved as draft successfully');
            })
            .addCase(createBlogThunk.rejected, (state) => {
                state.isCreating = false;
            })
            // Publish Blog
            .addCase(publishBlogThunk.pending, (state) => {
                state.isPublishing = true;
            })
            .addCase(publishBlogThunk.fulfilled, (state, action) => {
                state.isPublishing = false;
                const blogId = action.meta.arg;
                const blog = state.myBlogs.find(b => b._id === blogId);
                if (blog) {
                    blog.status = 'published';
                    blog.publishedAt = new Date().toISOString();
                }
            })
            .addCase(publishBlogThunk.rejected, (state) => {
                state.isPublishing = false;
            })
            // Unpublish Blog
            .addCase(unPublishBlogThunk.pending, (state) => {
                state.isPublishing = true;
            })
            .addCase(unPublishBlogThunk.fulfilled, (state, action) => {
                state.isPublishing = false;
                const blogId = action.meta.arg;
                const blog = state.myBlogs.find(b => b._id === blogId);
                if (blog) {
                    blog.status = 'unpublished';
                }
            })
            .addCase(unPublishBlogThunk.rejected, (state) => {
                state.isPublishing = false;
            })
            // Edit Blog
            .addCase(editBlogThunk.pending, (state) => {
                state.isEditingBlog = true;
            })
            .addCase(editBlogThunk.fulfilled, (state, action) => {
                state.isEditingBlog = false;
                const index = state.myBlogs.findIndex(b => b._id === action.payload._id);
                if (index !== -1) {
                    state.myBlogs[index] = action.payload;
                }
            })
            .addCase(editBlogThunk.rejected, (state) => {
                state.isEditingBlog = false;
            })
            // Delete Blog
            .addCase(deleteBlogThunk.pending, (state) => {
                state.isDeletingBlog = true;
            })
            .addCase(deleteBlogThunk.fulfilled, (state, action) => {
                state.isDeletingBlog = false;
                const blogId = action.meta.arg;
                state.myBlogs = state.myBlogs.filter(b => b._id !== blogId);
            })
            .addCase(deleteBlogThunk.rejected, (state) => {
                state.isDeletingBlog = false;
            })
            // Fetch My Blogs
            .addCase(fetchMyBlogs.pending, (state) => {
                state.isLoadingMyBlogs = true;
            })
            .addCase(fetchMyBlogs.fulfilled, (state, action) => {
                state.isLoadingMyBlogs = false;
                state.myBlogs = action.payload;
            })
            .addCase(fetchMyBlogs.rejected, (state) => {
                state.isLoadingMyBlogs = false;
            })
            // Fetch My Comments
            .addCase(fetchMyComments.pending, (state) => {
                state.isLoadingMyComments = true;
            })
            .addCase(fetchMyComments.fulfilled, (state, action) => {
                state.isLoadingMyComments = false;
                state.myComments = action.payload;
            })
            .addCase(fetchMyComments.rejected, (state) => {
                state.isLoadingMyComments = false;
            })
            // Check Comment Like Status
            .addCase(checkCommentLikeStatus.fulfilled, (state, action) => {
                const comment = state.comments.find((c) => c._id === action.meta.arg);
                if (comment) {
                    comment.isLiked = action.payload;
                }
            })
            // Like Comment
            .addCase(likeComment.pending, (state, action) => {
                state.isLikingComments[action.meta.arg] = true;
            })
            .addCase(likeComment.fulfilled, (state, action) => {
                const comment = state.comments.find((c) => c._id === action.meta.arg);
                if (comment) {
                    comment.noOfLikes += 1;
                    comment.isLiked = true;
                }
                delete state.isLikingComments[action.meta.arg];
            })
            .addCase(likeComment.rejected, (state, action) => {
                delete state.isLikingComments[action.meta.arg];
            })
            // Unlike Comment
            .addCase(unlikeComment.pending, (state, action) => {
                state.isLikingComments[action.meta.arg] = true;
            })
            .addCase(unlikeComment.fulfilled, (state, action) => {
                const comment = state.comments.find((c) => c._id === action.meta.arg);
                if (comment) {
                    comment.noOfLikes -= 1;
                    comment.isLiked = false;
                }
                delete state.isLikingComments[action.meta.arg];
            })
            .addCase(unlikeComment.rejected, (state, action) => {
                delete state.isLikingComments[action.meta.arg];
            });
    }
});

export const { setFilters, resetFilters, clearCurrentBlog, clearBlogs } = blogSlice.actions;
export default blogSlice.reducer;