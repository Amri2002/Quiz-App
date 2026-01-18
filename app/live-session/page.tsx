'use client'

import { useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Zap } from 'lucide-react'

export default function LiveSessionPage() {
  const [selectedQuiz, setSelectedQuiz] = useState('')
  const [isStarting, setIsStarting] = useState(false)

  const quizzes = [
    { id: '1', name: 'Biology 101 - Chapter 3', questions: 15 },
    { id: '2', name: 'History Quiz - World War II', questions: 20 },
    { id: '3', name: 'Math Fundamentals', questions: 10 },
    { id: '4', name: 'Chemistry - Periodic Table', questions: 25 },
  ]

  const handleStartSession = () => {
    if (!selectedQuiz) return
    setIsStarting(true)
    setTimeout(() => {
      window.location.href = `/live-session/${selectedQuiz}`
    }, 500)
  }

  return (
    <DashboardLayout title="Host Live Session" subtitle="Create an engaging Kahoot-style quiz for your classroom">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quiz Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select Quiz</CardTitle>
              <CardDescription>Choose which quiz to host as a live session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {quizzes.map(quiz => (
                  <div
                    key={quiz.id}
                    onClick={() => setSelectedQuiz(quiz.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedQuiz === quiz.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 bg-card'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{quiz.name}</h3>
                        <p className="text-sm text-foreground/60 mt-1">{quiz.questions} questions</p>
                      </div>
                      <div className={`w-5 h-5 border-2 rounded-full ${selectedQuiz === quiz.id ? 'border-primary bg-primary' : 'border-border'}`}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleStartSession}
                  disabled={!selectedQuiz || isStarting}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-base font-semibold"
                >
                  {isStarting ? 'Starting Session...' : 'Start Live Session'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Live Session Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">How It Works</h4>
                <ul className="text-sm text-foreground/60 space-y-2">
                  <li>• Display questions on your screen</li>
                  <li>• Students answer on their devices</li>
                  <li>• See real-time leaderboard</li>
                  <li>• Award points for speed & accuracy</li>
                </ul>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <p className="text-xs text-foreground font-semibold mb-2">Share with Students</p>
                <code className="text-xs bg-background/50 p-2 rounded block font-mono break-all">
                  quizlab.app/join/LIVE123
                </code>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Quick Features</h4>
                <ul className="text-sm text-foreground/60 space-y-2">
                  <li>✓ Live leaderboard</li>
                  <li>✓ Sound effects</li>
                  <li>✓ Time limits</li>
                  <li>✓ Colorful answer buttons</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-xs text-foreground/60 text-center">
                Tip: Ensure all students have joined before you start the session
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
