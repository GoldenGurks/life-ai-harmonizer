
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Users, Heart, Share2, Settings } from 'lucide-react';

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  favoriteRecipes: string[];
  sharedRecipes: string[];
  followers: string[];
  following: string[];
}

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileData>({
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Passionate home cook who loves sharing healthy recipes',
    favoriteRecipes: [],
    sharedRecipes: [],
    followers: [],
    following: []
  });

  const [isEditing, setIsEditing] = useState(false);
  const [friendCode, setFriendCode] = useState('');

  const handleSaveProfile = () => {
    setIsEditing(false);
    // TODO: Save to backend
  };

  const handleConnectFriend = () => {
    if (friendCode.trim()) {
      // TODO: Connect to friend using friend code
      setFriendCode('');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Settings className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Name"
                  />
                  <Input
                    value={profile.bio || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Bio"
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold">{profile.name}</h3>
                  <p className="text-muted-foreground">{profile.bio}</p>
                </>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <Button onClick={handleSaveProfile}>Save Changes</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{profile.sharedRecipes.length}</div>
              <div className="text-sm text-muted-foreground">Shared Recipes</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{profile.followers.length}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{profile.following.length}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Connect with Friends
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Share your friend code: <Badge variant="outline">{profile.id}</Badge>
            </p>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Enter friend's code"
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value)}
            />
            <Button onClick={handleConnectFriend}>
              <Users className="h-4 w-4 mr-2" />
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="shared" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shared">Shared Recipes</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="shared" className="space-y-4">
          <div className="text-center py-8">
            <Share2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No shared recipes yet</h3>
            <p className="text-muted-foreground">Start sharing your favorite recipes with friends!</p>
          </div>
        </TabsContent>
        
        <TabsContent value="favorites" className="space-y-4">
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No favorite recipes yet</h3>
            <p className="text-muted-foreground">Save recipes you love to see them here.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="friends" className="space-y-4">
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No friends connected yet</h3>
            <p className="text-muted-foreground">Connect with friends to share recipes and discover new ones!</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
