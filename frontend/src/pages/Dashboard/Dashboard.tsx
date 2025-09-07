// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store'; // Assume you have RootState type
import { fetchMyBlogs, fetchMyComments } from '../../store/blogSlice';
import { fetchFollowers } from '../../store/userSlice';
import Analytics from './Analytics';
import Profile from './Profile';
import Blogs from './Blogs';
import Followers from './Followers';
import Comments from './Comments';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppDispatch } from '@/store/hooks';

const Dashboard: React.FC = () => {
  const [section, setSection] = useState<'analytics' | 'profile' | 'blogs' | 'followers' | 'comments'>('analytics');
  const dispatch = useAppDispatch();
  const { authUser, isCheckingAuth } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (authUser) {
      dispatch(fetchMyBlogs());
      dispatch(fetchMyComments());
      dispatch(fetchFollowers());
    }
  }, [authUser, dispatch]);

  if (isCheckingAuth || !authUser) {
    return <Skeleton className="h-screen w-full" />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Card className="w-64 p-4 border-r border-border">
        <nav>
          <ul className="space-y-2">
            <li>
              <Button
                variant={section === 'analytics' ? 'default' : 'ghost'}
                className="w-full justify-start bg-gradient-primary text-primary-foreground"
                onClick={() => setSection('analytics')}
              >
                Analytics
              </Button>
            </li>
            <li>
              <Button
                variant={section === 'profile' ? 'default' : 'ghost'}
                className="w-full justify-start bg-gradient-primary text-primary-foreground"
                onClick={() => setSection('profile')}
              >
                Profile
              </Button>
            </li>
            <li>
              <Button
                variant={section === 'blogs' ? 'default' : 'ghost'}
                className="w-full justify-start bg-gradient-primary text-primary-foreground"
                onClick={() => setSection('blogs')}
              >
                Blogs
              </Button>
            </li>
            <li>
              <Button
                variant={section === 'followers' ? 'default' : 'ghost'}
                className="w-full justify-start bg-gradient-primary text-primary-foreground"
                onClick={() => setSection('followers')}
              >
                Followers
              </Button>
            </li>
            <li>
              <Button
                variant={section === 'comments' ? 'default' : 'ghost'}
                className="w-full justify-start bg-gradient-primary text-primary-foreground"
                onClick={() => setSection('comments')}
              >
                Comments
              </Button>
            </li>
          </ul>
        </nav>
      </Card>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {section === 'analytics' && <Analytics />}
        {section === 'profile' && <Profile />}
        {section === 'blogs' && <Blogs />}
        {section === 'followers' && <Followers />}
        {section === 'comments' && <Comments />}
      </div>
    </div>
  );
};

export default Dashboard;