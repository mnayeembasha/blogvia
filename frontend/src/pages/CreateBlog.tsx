import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { createBlogThunk, publishBlogThunk } from '../store/blogSlice'; // Adjust path
import { type AppDispatch, type RootState } from '../store';

const CATEGORIES = [
  { label: 'General', value: 'general' },
  { label: 'Technology', value: 'technology' },
  { label: 'Lifestyle', value: 'lifestyle' },
  { label: 'Business', value: 'business' },
  { label: 'Health', value: 'health' },
  { label: 'Education', value: 'education' },
];

interface BlogFormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  image?: string;
}

// Zod schema for form validation
const blogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  content: z.string().min(1, 'Content is required'),
  category: z.enum(['general', 'technology', 'lifestyle', 'business', 'health', 'education'], {
    message: 'Invalid category',
  }),
  tags: z.array(z.string().min(1, 'Tags cannot be empty')).optional(),
  image: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // Allow undefined image
        return val.startsWith('data:image/');
      },
      { message: 'File must be an image' }
    ),
});

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const CreateBlog: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isCreating, isPublishing } = useSelector((state: RootState) => state.blog);

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    category: 'general',
    tags: [],
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [tagsInput, setTagsInput] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
    const tagsArray = e.target.value.split(',').map((tag) => tag.trim()).filter((tag) => tag);
    setFormData((prev) => ({ ...prev, tags: tagsArray }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        e.target.value = '';
        return;
      }

      // Validate file size
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error('Image size exceeds 5MB');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImageBase64(base64);
        setImagePreview(base64);
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      // Validate form data with Zod
      const validationResult = blogSchema.safeParse({ ...formData, image: imageBase64 });
      if (!validationResult.success) {
        const errors = validationResult.error.issues.map((err) => err.message).join(', ');
        toast.error(`Validation failed: ${errors}`);
        return;
      }

      await dispatch(createBlogThunk({ ...formData, image: imageBase64 })).unwrap();
      navigate('/my-blogs'); // Adjust route as needed
    } catch (error) {
      // Error handled in thunk
      console.error(error);
    }
  };

  const handlePublish = async () => {
    try {
      // Validate form data with Zod
      const validationResult = blogSchema.safeParse({ ...formData, image: imageBase64 });
      if (!validationResult.success) {
        const errors = validationResult.error.issues.map((err) => err.message).join(', ');
        toast.error(`Validation failed: ${errors}`);
        return;
      }

      const createResult = await dispatch(createBlogThunk({ ...formData, image: imageBase64 })).unwrap();
      await dispatch(publishBlogThunk(createResult._id)).unwrap();
      navigate('/'); // Adjust to home or blog page
    } catch (error) {
      console.error(error);
      // Error handled in thunk
    }
  };

  const isLoading = isCreating || isPublishing;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Create New Blog</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Section */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter blog title"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={handleCategoryChange} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.filter((cat) => cat.value !== 'all').map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tagsInput}
              onChange={handleTagsChange}
              placeholder="e.g., tech, ai, programming"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="image">Image (max 5MB)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isLoading}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 max-h-48 w-auto rounded-lg shadow-md"
              />
            )}
          </div>
          <div>
            <Label htmlFor="content">Content (Markdown)</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Write your blog content in Markdown..."
              className="h-96"
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <Button onClick={handleSaveAsDraft} disabled={isLoading} variant="outline">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save as Draft
            </Button>
            <Button onClick={handlePublish} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Publish
            </Button>
          </div>
        </div>
        {/* Preview Section */}
        <div className="space-y-6 lg:sticky lg:top-4 self-start">
          <h2 className="text-2xl font-semibold">Preview</h2>
          <div className="prose dark:prose-invert max-w-none border rounded-lg p-6 bg-background">
            <h1>{formData.title || 'Blog Title'}</h1>
            {imagePreview && <img src={imagePreview} alt="Blog Image" className="max-w-full h-auto mb-4" />}
            <ReactMarkdown>{formData.content}</ReactMarkdown>
            <div className="mt-4">
              <span className="text-sm text-muted-foreground">Category: {formData.category}</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 text-xs bg-accent rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
