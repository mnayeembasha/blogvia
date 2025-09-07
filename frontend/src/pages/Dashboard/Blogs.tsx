import React, { useState } from 'react';
import {  useSelector } from 'react-redux';
import { type RootState } from '../../store';
import { editBlogThunk, publishBlogThunk, unPublishBlogThunk, deleteBlogThunk } from '../../store/blogSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import type { BlogType } from '@/store/blogSlice';
import { useAppDispatch } from '@/store/hooks';

const Blogs: React.FC = () => {
  const dispatch = useAppDispatch();
  const { myBlogs, isLoadingMyBlogs, isEditingBlog, isPublishing, isDeletingBlog } = useSelector((state: RootState) => state.blog);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogType | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState('');

  const openEditModal = (blog: BlogType) => {
    setSelectedBlog(blog);
    setTitle(blog.title);
    setContent(blog.content);
    setCategory(blog.category);
    setTags(blog.tags.join(', '));
    setPreview(blog.image);
    setEditModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setPreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = () => {
    if (selectedBlog) {
      dispatch(editBlogThunk({
        id: selectedBlog._id,
        data: {
          title,
          content,
          category,
          tags: tags.split(',').map(t => t.trim()),
          image: image || undefined,
        }
      }));
      setEditModalOpen(false);
    }
  };

  const handlePublish = (id: string, status: string) => {
    if (status === 'published') {
      dispatch(unPublishBlogThunk(id));
    } else {
      dispatch(publishBlogThunk(id));
    }
  };

  const handleDelete = (id: string) => {
    dispatch(deleteBlogThunk(id));
  };

  if (isLoadingMyBlogs) {
    return <Skeleton className="h-[500px] w-full" />;
  }

  return (
    <div className="space-y-4">
      {myBlogs.map((blog:BlogType) => (
        <Card key={blog._id}>
          <CardHeader>
            <CardTitle>{blog.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover rounded" />
            <p className="text-sm text-muted-foreground">{blog.content.substring(0, 100)}...</p>
            <p>Status: {blog.status}</p>
            <p>Category: {blog.category}</p>
            <p>Tags: {blog.tags.join(', ')}</p>
            <div className="flex space-x-2">
              <Button onClick={() => openEditModal(blog)} variant="outline">Edit</Button>
              <Button
                onClick={() => handlePublish(blog._id, blog.status)}
                disabled={isPublishing}
                className="bg-gradient-primary"
              >
                {blog.status === 'published' ? 'Unpublish' : 'Publish'}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(blog._id)} disabled={isDeletingBlog}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Blog</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma separated)" />
            <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded" />
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            <Button onClick={handleEditSubmit} disabled={isEditingBlog} className="w-full bg-gradient-primary">
              {isEditingBlog ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Blogs;