import React from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { CommentType } from '@/store/blogSlice';

const Comments: React.FC = () => {
  const { myComments, isLoadingMyComments } = useSelector((state: RootState) => state.blog);

  if (isLoadingMyComments) {
    return <Skeleton className="h-[500px] w-full" />;
  }

  if (myComments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comments on Your Blogs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No comments yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments on Your Blogs</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-6">
          {myComments.map((comment:CommentType) => (
            <li key={comment._id} className="border-b pb-4">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src={comment.userId.profilePic} />
                  <AvatarFallback>{comment.userId.fullName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{comment.userId.fullName}</p>
                    <p className="text-sm text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="mt-1">{comment.content}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default Comments;