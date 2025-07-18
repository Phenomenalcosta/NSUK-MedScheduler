'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAdminAuthStore } from '@/store/Admin/adminAuthStore'
import { toast } from 'react-hot-toast'

export function useAdminLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const signOut = useAdminAuthStore(state => state.signOut)

  // Reset isLoggingOut when we reach the admin login page
  useEffect(() => {
    if (isLoggingOut && pathname === '/admin/login') {
      setIsLoggingOut(false)
    }
  }, [pathname, isLoggingOut])

  const logout = async (redirectTo = '/admin/login') => {
    if (isLoggingOut) return 
    
    // Ensure redirectTo is a valid string path
    const loginPath = typeof redirectTo === 'string' && redirectTo.startsWith('/') 
      ? redirectTo 
      : '/admin/login'
    
    setIsLoggingOut(true)
    
    try {
      // Then sign out
      await signOut()
      
      // Navigate to admin login page using validated path
      router.replace(loginPath)

    } catch (error) {
      console.error('Admin logout failed:', error)
      toast.error('Admin logout failed. Please try again.')
      setIsLoggingOut(false)
    }
  }

  return { logout, isLoggingOut }
} 