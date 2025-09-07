import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ChevronDown } from 'lucide-react';
import { fetchBlogsWithFilters, setFilters } from '../store/blogSlice';
import { type RootState, type AppDispatch } from '../store';
import { BlogLoadingSkeleton } from '@/components/BlogLoadingSkeletion';
import { BlogCard } from '@/components/BlogCard';

const CATEGORIES = [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'technology', label: 'Technology' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'business', label: 'Business' },
    { value: 'health', label: 'Health' },
    { value: 'education', label: 'Education' }
];

const SORT_OPTIONS = [
    { value: 'publishedAt', label: 'Latest' },
    { value: 'likes', label: 'Most Liked' },
    // { value: 'title', label: 'Alphabetical' }
];

export const BlogShowCase: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { blogs, isLoading, filters, pagination } = useSelector((state: RootState) => state.blog);
    const [searchInput, setSearchInput] = useState(filters.search);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);



    useEffect(() => {
        dispatch(fetchBlogsWithFilters(filters));
    }, [dispatch, filters]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setFilters({ search: searchInput, page: 1 }));
    };

    const handleCategoryChange = (category: string) => {
        dispatch(setFilters({ category, page: 1 }));
    };

    const handleSortChange = (sortBy: string) => {
        dispatch(setFilters({ sortBy, page: 1 }));
    };

    const CategoryTabs = () => (
        <div className="hidden md:flex flex-wrap gap-2 mb-8 justify-center">
            {CATEGORIES.map((category) => (
                <button
                    key={category.value}
                    onClick={() => handleCategoryChange(category.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        filters.category === category.value
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary'
                    }`}
                >
                    {category.label}
                </button>
            ))}
        </div>
    );

    const CategoryDropdown = () => (
        <div className="md:hidden relative mb-6">
            <select
                value={filters.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full appearance-none bg-card border border-border rounded-lg px-4 py-3 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
                {CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                        {category.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gradient-primary">
                        Discover Amazing Stories
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Explore insights, tutorials, and stories from our community of writers
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-8">
                    <form onSubmit={handleSearch} className="flex gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search blogs, tags, or content..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                        {/* <Filter className="w-5 h-5 text-muted-foreground" /> */}
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="bg-card border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                {SORT_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        Sort by {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                        >
                            Search
                        </button>
                        <button
                            onClick={() => {
                                setSearchInput('');
                                dispatch(setFilters({ search: '', category: 'all', page: 1 }));
                            }}
                            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                        >
                            Clear Filters
                        </button>
                    </form>

                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">


                        <div className="text-sm text-muted-foreground">
                            {pagination.totalBlogs} blogs found
                        </div>
                    </div>
                </div>

                {/* Category Navigation */}
                {isMobile ? <CategoryDropdown /> : <CategoryTabs />}

                {/* Loading State */}
                {isLoading && <BlogLoadingSkeleton />}

                {/* Blog Grid */}
                {!isLoading && blogs.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {blogs.map((blog) => (
                                <BlogCard key={blog._id} blog={blog} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center space-x-4">
                                <button
                                    onClick={() => dispatch(setFilters({ page: filters.page - 1 }))}
                                    disabled={!pagination.hasPrevPage}
                                    className="px-4 py-2 bg-card border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                                >
                                    Previous
                                </button>

                                <div className="flex items-center space-x-2">
                                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        // Calculate the start page to center around currentPage
                                        const startPage = Math.max(1, pagination.currentPage - Math.floor(5 / 2));
                                        const pageNumber = startPage + i;

                                        // Skip if pageNumber exceeds totalPages
                                        if (pageNumber > pagination.totalPages) return null;

                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => dispatch(setFilters({ page: pageNumber }))}
                                                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                                    pagination.currentPage === pageNumber
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-card border border-border hover:bg-accent'
                                                }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => dispatch(setFilters({ page: filters.page + 1 }))}
                                    disabled={!pagination.hasNextPage}
                                    className="px-4 py-2 bg-card border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* No Results */}
                {!isLoading && blogs.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-32 h-32 mx-auto mb-8 bg-muted rounded-full flex items-center justify-center">
                            <Search className="w-16 h-16 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-4">No Blogs Found</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            We couldn't find any blogs matching your criteria. Try adjusting your search or filters.
                        </p>
                        <button
                            onClick={() => {
                                setSearchInput('');
                                dispatch(setFilters({ search: '', category: 'all', page: 1 }));
                            }}
                            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
