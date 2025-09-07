// Analytics.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { CommentType } from '@/store/blogSlice';
import type { UserType } from '@/types';

const Analytics: React.FC = () => {
  const { myBlogs, isLoadingMyBlogs, myComments, isLoadingMyComments } = useSelector((state: RootState) => state.blog);
  const { followers, isLoadingFollowers } = useSelector((state: RootState) => state.user);

  if (isLoadingMyBlogs || isLoadingMyComments || isLoadingFollowers) {
    return <Skeleton className="h-[500px] w-full" />;
  }

  const totalBlogs = myBlogs.length;
  const totalFollowers = followers.length;
  const totalComments = myComments.length;

  const recentFollowers = followers.slice(0, 5);
  const recentComments = myComments.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-warm">
          <CardHeader>
            <CardTitle>Total Blogs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalBlogs}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-warm">
          <CardHeader>
            <CardTitle>Total Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalFollowers}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-warm">
          <CardHeader>
            <CardTitle>Total Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalComments}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Followers</CardTitle>
          </CardHeader>
          <CardContent>
            {recentFollowers.length === 0 ? (
              <p className="text-muted-foreground">No recent followers</p>
            ) : (
              <ul className="space-y-4">
                {recentFollowers.map((follower:UserType) => (
                  <li key={follower._id} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={follower.profilePic} />
                      <AvatarFallback>{follower.fullName}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{follower.fullName}</p>
                      <p className="text-sm text-muted-foreground">@{follower.username}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Comments</CardTitle>
          </CardHeader>
          <CardContent>
            {recentComments.length === 0 ? (
              <p className="text-muted-foreground">No recent comments</p>
            ) : (
              <ul className="space-y-4">
                {recentComments.map((comment:CommentType) => (
                  <li key={comment._id} className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={comment.userId.profilePic} />
                        <AvatarFallback>{comment.userId.fullName[0]}</AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium">{comment.userId.fullName}</p>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                    <p className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;