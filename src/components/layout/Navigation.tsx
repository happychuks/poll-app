"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, Menu, X, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, signOut } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSignOut = async () => {
    await signOut()
    // The middleware will handle the redirect
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">PollApp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/polls" className="text-gray-600 hover:text-gray-900 font-medium">
              Browse Polls
            </Link>
            {isAuthenticated && (
              <Link href="/polls/create" className="text-gray-600 hover:text-gray-900 font-medium">
                Create Poll
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
                  Dashboard
                </Link>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {user?.user_metadata?.name || user?.email}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMenu}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <Link href="/polls" className="text-gray-600 hover:text-gray-900 font-medium">
                Browse Polls
              </Link>
              {isAuthenticated && (
                <Link href="/polls/create" className="text-gray-600 hover:text-gray-900 font-medium">
                  Create Poll
                </Link>
              )}
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
                    Dashboard
                  </Link>
                  <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center space-x-2 py-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {user?.user_metadata?.name || user?.email}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleSignOut} className="justify-start">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                  <Button variant="ghost" asChild>
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
