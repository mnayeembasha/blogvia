import { formatDate } from "@/lib/utils";
import type { ExtendedCommentType } from "@/store/blogSlice";
import { Heart, User, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { likeComment, unlikeComment } from "@/store/blogSlice";
import { type RootState, type AppDispatch } from '@/store';

export const CommentCard: React.FC<{ comment: ExtendedCommentType}> = ({ comment }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLikingComments } = useSelector((state: RootState) => state.blog);

    const handleLikeComment = () => {
        if (comment.isLiked) {
            dispatch(unlikeComment(comment._id));
        } else {
            dispatch(likeComment(comment._id));
        }
    };

    const isLiking = isLikingComments[comment._id] || false;

    return (
        <div className="bg-card rounded-lg p-6 border border-border/50">
            <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {comment.userId.profilePic ? (
                        <img
                            src={comment.userId.profilePic}
                            alt={comment.userId.username}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <User className="w-5 h-5 text-primary" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-sm">
                            {comment.userId.fullName}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                            {comment.userId.username}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                        </span>
                    </div>

                    <p className="text-foreground mb-3 leading-relaxed">
                        {comment.content}
                    </p>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleLikeComment}
                            disabled={isLiking}
                            className={`flex items-center space-x-1 text-sm transition-colors ${
                                comment.isLiked ? 'text-red-500' : 'text-muted-foreground'
                            } hover:text-red-500`}
                        >
                            {isLiking ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                            )}
                            <span>{comment.noOfLikes}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};