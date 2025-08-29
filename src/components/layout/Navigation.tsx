"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BarChart3, Menu, X, User, LogOut } from "lucide-react"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false) // TODO: Replace with actual auth state

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">PollApp</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/polls" className="text-gray-600 hover:text-gray-900 font-medium">
              Browse Polls
            </a>
            <a href="/polls/create" className="text-gray-600 hover:text-gray-900 font-medium">
              Create Poll
            </a>
            {isAuthenticated ? (
              <>
                <a href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
                  Dashboard
                </a>
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <a href="/auth/login">Sign In</a>
                </Button>
                <Button asChild>
                  <a href="/auth/register">Sign Up</a>
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
              <a href="/polls" className="text-gray-600 hover:text-gray-900 font-medium">
                Browse Polls
              </a>
              <a href="/polls/create" className="text-gray-600 hover:text-gray-900 font-medium">
                Create Poll
              </a>
              {isAuthenticated ? (
                <>
                  <a href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
                    Dashboard
                  </a>
                  <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                    <Button variant="ghost" size="sm" className="justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                  <Button variant="ghost" asChild>
                    <a href="/auth/login">Sign In</a>
                  </Button>
                  <Button asChild>
                    <a href="/auth/register">Sign Up</a>
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
