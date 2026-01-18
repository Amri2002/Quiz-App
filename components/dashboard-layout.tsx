'use client'

import React from "react"

import { useState } from 'react'
import SidebarNavigation from './sidebar-navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const [role, setRole] = useState<'teacher' | 'student'>('teacher')

  return (
    <div className="min-h-screen bg-background">
      <SidebarNavigation role={role} onRoleChange={setRole} />
      
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
