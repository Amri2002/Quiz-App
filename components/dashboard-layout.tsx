'use client'

import React from "react"

import { useState, useEffect } from 'react'
import SidebarNavigation from './sidebar-navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  role?: 'teacher' | 'student'
}

export default function DashboardLayout({ children, title, subtitle, role: propRole }: DashboardLayoutProps) {
  const [role, setRole] = useState<'teacher' | 'student'>('teacher')

  useEffect(() => {
    // If role is provided as prop, use it
    if (propRole) {
      setRole(propRole)
      return
    }

    // Otherwise read from localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setRole(userData.userType || 'teacher')
      } catch (error) {
        console.error('Error parsing user data:', error)
        setRole('teacher')
      }
    }
  }, [propRole])

  return (
    <div className="min-h-screen bg-background">
      <SidebarNavigation role={role} />
      
      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        {(title || subtitle) && (
          <div className="mb-8">
            {title && <h1 className="text-4xl font-bold text-foreground mb-2">{title}</h1>}
            {subtitle && <p className="text-lg text-foreground/70">{subtitle}</p>}
          </div>
        )}
        
        {children}
      </main>
    </div>
  )
}
