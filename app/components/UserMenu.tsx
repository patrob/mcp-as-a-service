'use client'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { useAuthEnabled } from '@/hooks/useFeatureFlags'
import { FeatureNotAvailable } from '@/components/ComingSoon'

export function UserMenu() {
  const { data: session } = useSession()
  const { isEnabled: authEnabled, isLoading } = useAuthEnabled()
  
  // Show loading state while feature flags are being fetched
  if (isLoading) {
    return (
      <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"></div>
    )
  }
  
  // If auth is not enabled, don't show any auth-related UI
  if (!authEnabled) {
    return null
  }
  
  if (!session) {
    return (
      <Link
        href="/login"
        className="text-slate-600 hover:text-slate-900 transition-colors"
      >
        Sign In
      </Link>
    )
  }
  
  const user = session.user
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-8 h-8" data-testid="user-menu-trigger">
          {user?.image && (
            <AvatarImage src={user.image} alt={user.name ?? 'User'} />
          )}
          <AvatarFallback>{user?.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-2 py-1 text-sm">{user?.name}</div>
        <DropdownMenuItem onSelect={() => signOut()}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
