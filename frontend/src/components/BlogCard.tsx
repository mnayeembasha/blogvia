import  { type BlogType } from "@/store/blogSlice";
import { Calendar, Heart, User } from "lucide-react";
import { Link } from "react-router-dom";

export const BlogCard: React.FC<{ blog: BlogType }> = ({ blog }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Link
            to={`/${blog.author.username}/${blog.slug}`}
            className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/20"
        >
            <div className="aspect-video overflow-hidden">
                <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                        {blog.category}
                    </span>
                    <div className="flex items-center text-muted-foreground text-sm">
                        <Heart className={blog.noOfLikes > 0 ? 'w-4 h-4 mr-1 text-red-600 fill-current' : 'w-4 h-4 mr-1 text-muted-foreground'} />
                        {blog.noOfLikes}
                    </div>
                </div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2 text-gradient-primary">
                    {blog.title}
                </h3>

                <p className="text-muted-foreground mb-4 line-clamp-3">
                    {blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {blog.author.profilePic ? (
                                <img
                                    src={blog.author.profilePic}
                                    alt={blog.author.username}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <User className="w-4 h-4 text-primary" />
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-medium">
                                {blog.author.fullName}
                            </p>
                            <p className="text-xs text-muted-foreground">{blog.author.username}</p>
                        </div>
                    </div>

                    <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(blog.publishedAt)}
                    </div>
                </div>

                {/* {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {blog.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 text-xs bg-accent text-accent-foreground rounded-lg"
                            >
                                #{tag}
                            </span>
                        ))}
                        {blog.tags.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                                +{blog.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )} */}
            </div>
        </Link>
    );
};
