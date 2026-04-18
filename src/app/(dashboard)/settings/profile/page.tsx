'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Camera, Save } from 'lucide-react';

export default function ProfileSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarSrc(url);
  }

  return (
    <Card className="border border-black/5 shadow-sm">
      <div className="p-6 pb-4">
        <h3 className="text-lg font-semibold">Profile Settings</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Update your personal information and credentials
        </p>
      </div>

      <Separator className="bg-black/5" />

      <CardContent className="p-6 space-y-8">
        {/* Avatar */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Profile Picture</Label>
          <div className="relative inline-block mt-1">
            <div className="h-20 w-20 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-md overflow-hidden">
              {avatarSrc ? (
                <Image src={avatarSrc} alt="Profile" fill className="object-cover" />
              ) : (
                <User className="h-10 w-10 stroke-[1.5]" />
              )}
            </div>
            {/* Hidden real file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {/* Camera trigger badge */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload profile picture"
              className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white hover:bg-emerald-600 active:scale-95 transition-all"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          {avatarSrc && (
            <p className="text-xs text-muted-foreground mt-2">New picture selected. Click Save Changes to apply.</p>
          )}
        </div>

        {/* Fields */}
        <div className="space-y-5 w-full">
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-sm font-medium text-foreground">Full Name</Label>
            <Input id="fullName" defaultValue="John Smith" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
            <Input id="email" type="email" defaultValue="smith@hospital.com" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
          </div>
        </div>

        {/* Save */}
        <div>
          <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white h-11 px-8 rounded-lg text-sm font-medium gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
