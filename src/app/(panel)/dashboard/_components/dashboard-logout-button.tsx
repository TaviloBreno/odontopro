'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export function DashboardLogoutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-gray-500 hover:text-gray-700"
    >
      <LogOut className="w-4 h-4" />
    </Button>
  );
}