import React from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserType } from '@/types';

const Followers: React.FC = () => {
  const { followers, isLoadingFollowers } = useSelector((state: RootState) => state.user);

  if (isLoadingFollowers) {
    return <Skeleton className="h-[500px] w-full" />;
  }

  if (followers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Followers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No followers yet. Keep creating great content!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Followers</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {followers.map((follower:UserType) => (
            <li key={follower._id} className="flex items-center space-x-4 p-4 bg-accent rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={follower.profilePic} />
                <AvatarFallback>{follower.fullName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{follower.fullName}</p>
                <p className="text-sm text-muted-foreground">@{follower.username}</p>
                <p className="text-sm">{follower.bio?.substring(0, 50)}...</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default Followers;