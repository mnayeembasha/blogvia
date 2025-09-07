// Profile.tsx
import React, { useState } from 'react';
import {  useSelector } from 'react-redux';
import { type RootState } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { updateProfile } from '@/store/authSlice';
import type { UserType } from '@/types';
import { useAppDispatch } from '@/store/hooks';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { authUser, isUpdatingProfile } = useSelector((state: RootState) => state.auth);

  const [bio, setBio] = useState(authUser?.bio || '');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [preview, setPreview] = useState(authUser?.profilePic || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
        setPreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    dispatch(updateProfile({ bio, profilePic: profilePic} as Partial<UserType>));
  };

  if (!authUser) {
    return <Skeleton className="h-[500px] w-full" />;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={preview} />
            <AvatarFallback>{authUser.fullName[0]}</AvatarFallback>
          </Avatar>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <p>{authUser.fullName}</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Username</label>
          <p>@{authUser.username}</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <p>{authUser.email}</p>
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium">Bio</label>
          <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <Button onClick={handleSubmit} disabled={isUpdatingProfile} className="bg-gradient-primary">
          {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Profile;