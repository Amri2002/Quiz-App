'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Play, Users, TrendingUp } from 'lucide-react'
import { CreateClassModal } from '@/components/classes/create-class-modal'

interface User {
  name: string
  email: string
}

interface RecentActivity {
  id: string
  student: string
  action: string
  quiz: string
  timestamp: string
  score?: string
}

export default function TeacherDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(storedUser))
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      student: 'Alice Johnson',
      action: 'completed',
      quiz: 'Biology 101 - Chapter 3',
      timestamp: '2 hours ago',
      score: '92%'
    },
    {
      id: '2',
      student: 'Bob Smith',
      action: 'started',
      quiz: 'History Quiz - World War II',
      timestamp: '1 hour ago'
    },
    {
      id: '3',
      student: 'Carol Davis',
      action: 'completed',
      quiz: 'Math Fundamentals',
      timestamp: '30 minutes ago',
      score: '78%'
    },
  ]

  const stats = [
    { label: 'Total Students', value: '147', color: 'bg-primary/10 text-primary' },
    { label: 'Quizzes Created', value: '24', color: 'bg-accent/10 text-accent' },
    { label: 'Average Pass Rate', value: '84%', color: 'bg-green-100 text-green-700' },
  ]

  return (
    <DashboardLayout title="Teacher Dashboard" subtitle={`Welcome back, ${user?.name}! Here's your teaching overview.`}>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card onClick={() => setIsCreateModalOpen(true)} className="cursor-pointer hover:shadow-lg transition-shadow h-full">
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center min-h-40">
            <div className="p-4 bg-primary/10 rounded-lg mb-4">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-foreground">Create New Class</h3>
            <p className="text-sm text-foreground/60 mt-2">Set up a new class for your students</p>
          </CardContent>
        </Card>

        <Link href="/quiz-generator">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardContent className="pt-6 flex flex-col items-center justify-center text-center min-h-40">
              <div className="p-4 bg-primary/10 rounded-lg mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">Generate Quiz</h3>
              <p className="text-sm text-foreground/60 mt-2">Create a new AI-powered quiz from materials</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/live-session">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardContent className="pt-6 flex flex-col items-center justify-center text-center min-h-40">
              <div className="p-4 bg-primary/10 rounded-lg mb-4">
                <Play className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">Host Live Session</h3>
              <p className="text-sm text-foreground/60 mt-2">Start a Kahoot-style live quiz</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                {stat.value}
              </div>
              <p className="text-foreground/60">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Student submissions and quiz completions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-card/50 transition">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{activity.student}</p>
                  <p className="text-sm text-foreground/60">{activity.action} <span className="font-medium">{activity.quiz}</span></p>
                </div>
                <div className="text-right">
                  {activity.score && (
                    <p className="font-semibold text-primary mb-1">{activity.score}</p>
                  )}
                  <p className="text-xs text-foreground/60">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CreateClassModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen}
      />
    </DashboardLayout>
  )
}
