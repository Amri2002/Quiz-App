'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  BookOpen, 
  Library, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react'

interface SidebarProps {
  role?: 'teacher' | 'student'
  onRoleChange?: (role: 'teacher' | 'student') => void
}

export default function SidebarNavigation({ role = 'teacher', onRoleChange }: SidebarProps) {
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false)

  const navigationItems = role === 'teacher' ? [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Classes', href: '/classes', icon: BookOpen },
    { label: 'Library', href: '/library', icon: Library },
    { label: 'Create Quiz', href: '/quiz-generator', icon: Library },
    { label: 'Reports', href: '/reports', icon: BarChart3 },
    { label: 'Settings', href: '/settings', icon: Settings },
  ] : [
    { label: 'Dashboard', href: '/student-dashboard', icon: LayoutDashboard },
    { label: 'My Quizzes', href: '/student-quiz', icon: BookOpen },
    { label: 'Library', href: '/library', icon: Library },
    { label: 'Reports', href: '/reports', icon: BarChart3 },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border min-h-screen fixed left-0 top-0 pt-6 overflow-y-auto">
      {/* Logo */}
      <div className="px-6 mb-8">
        <Link href="/" className="text-2xl font-bold text-sidebar-primary">
          QuizLab
        </Link>
      </div>

      {/* Role Selector */}
      <div className="px-6 mb-8">
        <div className="relative">
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-2 bg-sidebar-accent text-sidebar-accent-foreground rounded-lg hover:bg-sidebar-accent/80 transition"
          >
            <span className="font-semibold capitalize">{role}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {isRoleMenuOpen && (
            <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg z-50">
              <button
                onClick={() => {
                  onRoleChange?.('teacher')
                  setIsRoleMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-2 hover:bg-primary/10 ${role === 'teacher' ? 'text-primary font-semibold' : ''}`}
              >
                Teacher
              </button>
              <button
                onClick={() => {
                  onRoleChange?.('student')
                  setIsRoleMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-2 hover:bg-primary/10 ${role === 'student' ? 'text-primary font-semibold' : ''}`}
              >
                Student
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="px-3 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 left-6 right-6">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => {
            localStorage.removeItem('user')
            window.location.href = '/login'
          }}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  )
}
