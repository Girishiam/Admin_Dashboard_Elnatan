import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export default function SecuritySettingsPage() {
  return (
    <Card className="border border-black/5 shadow-sm">
      <div className="p-6 pb-4">
        <h3 className="text-lg font-semibold">Change Password</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Ensure your account uses a strong, unique password
        </p>
      </div>

      <Separator className="bg-black/5" />

      <CardContent className="p-6 space-y-8">
        {/* Fields */}
        <div className="space-y-5 w-full">
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword" className="text-sm font-medium text-foreground">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Enter your current password"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="newPassword" className="text-sm font-medium text-foreground">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter your new password"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Enter new password"
            />
          </div>
        </div>

        {/* Update */}
        <div>
          <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white h-11 px-8 rounded-lg text-sm font-medium gap-2">
            <Save className="h-4 w-4" />
            Update Password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
