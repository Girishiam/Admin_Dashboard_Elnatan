'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[520px]"
      >
        <Card className="border shadow-lg shadow-black/5 bg-card/95 backdrop-blur-sm overflow-hidden p-6 sm:p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-6 h-20 w-48 relative">
              {/* Requires public/logo_dark.png to be physically present */}
              <Image 
                src="/logo_dark.png" 
                alt="ADHD Proud Logo" 
                fill 
                sizes="200px"
                className="object-contain dark:invert"
                priority
              />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Login to Account
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Please enter your email and password to continue
            </p>
          </div>

          <CardContent className="p-0">
            <form 
              className="space-y-6" 
              onSubmit={(e) => {
                e.preventDefault();
                // Set auth cookie (1 day expiry) — in production replace with real JWT
                document.cookie = 'auth_token=admin_session; path=/; max-age=86400; SameSite=Lax';
                // Redirect to intended destination or home
                const params = new URLSearchParams(window.location.search);
                router.push(params.get('from') || '/');
              }}
            >
              {/* Email Address */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="esteban_schiller@gmail.com"
                  className="h-12 bg-background"
                  required
                />
              </div>

              {/* Password Area */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="*********"
                    className="h-12 bg-background pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Checkbox and Forget Password */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="h-4 w-4 rounded-sm border-primary/50 text-white data-[state=checked]:bg-[#3B82F6] data-[state=checked]:border-[#3B82F6]" />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none cursor-pointer text-muted-foreground"
                  >
                    Remember Password
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[#3B82F6] hover:underline hover:text-primary/90 transition-colors"
                >
                  Forget Password?
                </Link>
              </div>

              {/* Submit Action */}
              <Button type="submit" className="w-full h-12 text-md font-medium text-white shadow-md hover:shadow-lg transition-all rounded-md mt-2" style={{ backgroundColor: '#3B82F6' }}>
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
