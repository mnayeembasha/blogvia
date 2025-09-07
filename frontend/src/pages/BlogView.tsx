import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Heart,
    MessageCircle,
    Calendar,
    User,
    ArrowLeft,
    Send,
    Loader2,
    Eye,
    BookOpen,
} from 'lucide-react';
import {
    fetchBlogBySlugAndAuthor,
    fetchComments,
    likeBlog,
    unlikeBlog,
    postComment,
    checkBlogLikeStatus,
    clearCurrentBlog,
    checkCommentLikeStatus,
    type ExtendedCommentType
} from '../store/blogSlice';
import { type RootState, type AppDispatch } from '../store';
import { CommentCard } from '@/components/CommentCard';
import { formatDate } from '@/lib/utils';
import { MarkDownContent } from '@/components/MarkdownContent';

export const BlogView: React.FC = () => {
    const { username, slug } = useParams<{ username: string; slug: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const {
        currentBlog,
        comments,
        isLoadingBlog,
        isLoadingComments,
        isLiking,
        isCommenting,
        isLiked,
    } = useSelector((state: RootState) => state.blog);

    const { authUser } = useSelector((state: RootState) => state.auth);

    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        if (username && slug) {
            dispatch(clearCurrentBlog());
            dispatch(fetchBlogBySlugAndAuthor({ username, slug }));
        }

        return () => {
            dispatch(clearCurrentBlog());
        };
    }, [dispatch, username, slug]);

    useEffect(() => {
        if (currentBlog && authUser) {
            dispatch(checkBlogLikeStatus(currentBlog._id));
        }
    }, [dispatch, currentBlog, authUser]);

    useEffect(() => {
        if (currentBlog && showComments) {
            dispatch(fetchComments(currentBlog._id));
        }
    }, [dispatch, currentBlog, showComments]);

    useEffect(() => {
        if (comments.length > 0 && authUser) {
            comments.forEach((comment) => {
                dispatch(checkCommentLikeStatus(comment._id));
            });
        }
    }, [dispatch, comments, authUser]);

    const handleLike = () => {
        if (!authUser || !currentBlog) return;

        if (isLiked) {
            dispatch(unlikeBlog(currentBlog._id));
        } else {
            dispatch(likeBlog(currentBlog._id));
        }
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser || !currentBlog || !commentText.trim()) return;

        dispatch(postComment({
            blogId: currentBlog._id,
            content: commentText.trim()
        })).then(() => {
            setCommentText('');
        });
    };

    useEffect(()=>{
        setShowComments(true);
    },[showComments,setShowComments]);

    if (isLoadingBlog) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading blog...</p>
                </div>
            </div>
        );
    }

    if (!currentBlog) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-8 bg-muted rounded-full flex items-center justify-center">
                        <Eye className="w-16 h-16 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">Blog Not Found</h1>
                    <p className="text-muted-foreground mb-6">
                        The blog you're looking for doesn't exist or has been removed.
                    </p>
                    <button
                        onClick={() => navigate('/blogs')}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                        Back to Blogs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background font-source-serif-4">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/blogs')}
                    className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-8"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Blogs</span>
                </button>

                {/* Blog Header */}
                <article className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/50">
                    {/* Featured Image */}
                    <div className="aspect-[16/9] overflow-hidden">
                        <img
                            src={currentBlog.image}
                            alt={currentBlog.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Blog Content */}
                    <div className="p-8">


                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            {currentBlog.title}
                        </h1>

                        {/* Category and Date */}
                        <div className="flex items-center justify-between mb-6">
                            <span className="px-4 py-2 text-sm font-medium bg-gradient-primary text-primary rounded-full">
                                {currentBlog.category}
                            </span>
                            <div>
                                <div className="flex items-center text-muted-foreground text-sm">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {formatDate(currentBlog.publishedAt)}
                                </div>
                                <div className="flex items-center text-muted-foreground text-sm pt-2">
                                <span className='italic'>
                                    <span className='flex justify-center items-center'><BookOpen className="w-4 h-4 mr-2"/>{ Math.ceil(currentBlog.content.length / 1000).toFixed(0)} mins read</span>
                                </span>
                                </div>
                                {/* <div className="flex items-center text-muted-foreground text-sm">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {formatTime(currentBlog.publishedAt)}
                                </div> */}
                            </div>
                        </div>

                        {/* Author Info */}
                        <div className="flex items-center space-x-4 mb-8 p-4 bg-accent/50 rounded-2xl">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                {currentBlog.author.profilePic ? (
                                    <img
                                        src={currentBlog.author.profilePic}
                                        alt={currentBlog.author.username}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="w-8 h-8 text-primary" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-md font-semibold">
                                    {currentBlog.author.fullName}
                                </h3>
                                <p className="text-sm text-muted-foreground">{currentBlog.author.username}</p>
                            </div>
                        </div>

                        {/* Blog Content */}
                        {/* <div
                            className="prose prose-lg max-w-none mb-8 text-foreground"
                            dangerouslySetInnerHTML={formatContent(currentBlog.content)}
                        /> */}
                        <MarkDownContent content={currentBlog.content}/>

                        {/* Tags */}
                        {currentBlog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-8">
                                {currentBlog.tags.map((tag:string, index:number) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-full"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-6 py-6 border-t border-border">
                            {authUser ? (
                                <button
                                    onClick={handleLike}
                                    disabled={isLiking}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                        isLiked
                                            ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                                            : 'bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary border border-border'
                                    }`}
                                >
                                    {isLiking ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                    )}
                                    <span>{currentBlog.noOfLikes} {currentBlog.noOfLikes === 1 ? 'Like' : 'Likes'}</span>
                                </button>)
                                :(
                                    <button
                                        onClick={handleLike}
                                        disabled={isLiking}
                                        className={`flex items-center space-x-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200 border border-border font-medium

                                        `}
                                    >
                                        <Heart className={`w-5 h-5 text-red-500 ${currentBlog.noOfLikes > 0 ? 'fill-current' : ''}`} />
                                        <span>{currentBlog.noOfLikes} {currentBlog.noOfLikes === 1 ? 'Like' : 'Likes'}</span>
                                    </button>
                                )}

                            <button
                                className="flex items-center space-x-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200 border border-border font-medium"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span>
                                    {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                                </span>
                            </button>
                        </div>




                        {/* Comments Section */}
                        { authUser && (
                            <div className="mt-8 pt-8 border-t border-border">
                                <h3 className="text-2xl font-bold mb-6">Add Comment</h3>

                                {/* Comment Form */}
                                {(
                                    <form onSubmit={handleCommentSubmit} className="mb-8">
                                        <div className="flex space-x-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                {authUser.profilePic ? (
                                                    <img
                                                        src={authUser.profilePic}
                                                        alt={authUser.username}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-5 h-5 text-primary" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <textarea
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    placeholder="Write a comment..."
                                                    className="w-full p-4 border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    rows={3}
                                                />
                                                <div className="flex justify-end mt-3">
                                                    <button
                                                        type="submit"
                                                        disabled={!commentText.trim() || isCommenting}
                                                        className="flex items-center space-x-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isCommenting ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Send className="w-4 h-4" />
                                                        )}
                                                        <span>Post Comment</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                )}

                            </div>
                        )}

                        {/* Show Comments */}
                        <div className="mt-8 pt-8 border-t border-border">
                                <h3 className="text-2xl font-bold mb-6">Comments</h3>
                                {/* Comments List */}
                                {isLoadingComments ? (
                                    <div className="text-center py-8">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                                        <p className="text-muted-foreground">Loading comments...</p>
                                    </div>
                                ) : comments.length > 0 ? (
                                    <div className="space-y-6">
                                        {comments.map((comment:ExtendedCommentType) => (
                                            <CommentCard key={comment._id} comment={comment} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                        <h4 className="text-lg font-semibold mb-2">No Comments Yet</h4>
                                        <p className="text-muted-foreground">
                                            Be the first to share your thoughts on this blog post!
                                        </p>
                                    </div>
                                )}
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};