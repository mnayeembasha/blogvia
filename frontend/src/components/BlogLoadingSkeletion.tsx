export const BlogLoadingSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-card rounded-xl overflow-hidden shadow-sm border border-border/50 animate-pulse">
                <div className="aspect-video bg-muted"></div>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                        <div className="h-6 bg-muted rounded w-20"></div>
                        <div className="h-4 bg-muted rounded w-12"></div>
                    </div>
                    <div className="h-6 bg-muted rounded mb-3"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-4 w-3/4"></div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-muted rounded-full"></div>
                            <div>
                                <div className="h-4 bg-muted rounded w-20 mb-1"></div>
                                <div className="h-3 bg-muted rounded w-16"></div>
                            </div>
                        </div>
                        <div className="h-4 bg-muted rounded w-16"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);
