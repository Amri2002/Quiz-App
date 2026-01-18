'use client'

import Link from 'next/link'
import DashboardLayout from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Play, Clock, CheckCircle } from 'lucide-react'

interface Quiz {
  id: string
  title: string
  class: string
  questions: number
  duration: number
  score?: number
  completed: boolean
  completedAt?: string
}

const studentQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Biology 101 - Cell Structure',
    class: 'Biology 101',
    questions: 15,
    duration: 30,
    score: 92,
    completed: true,
    completedAt: '2 hours ago'
  },
  {
    id: '2',
    title: 'History Quiz - Medieval Era',
    class: 'World History',
    questions: 20,
    duration: 45,
    completed: false
  },
  {
    id: '3',
    title: 'Math - Calculus Fundamentals',
    class: 'Mathematics',
    questions: 12,
    duration: 25,
    score: 88,
    completed: true,
    completedAt: '1 day ago'
  },
  {
    id: '4',
    title: 'Physics - Motion & Forces',
    class: 'Physics',
    questions: 18,
    duration: 40,
    completed: false
  },
]

export default function StudentDashboard() {
  const completedQuizzes = studentQuizzes.filter(q => q.completed).length
  const totalScore = studentQuizzes.filter(q => q.completed).reduce((sum, q) => sum + (q.score || 0), 0) / completedQuizzes || 0

  return (
    <DashboardLayout title="My Quizzes" subtitle="Take quizzes assigned by your teachers">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-foreground/60 mb-1">Quizzes Completed</p>
              <p className="text-3xl font-bold text-foreground">{completedQuizzes}</p>
              <p className="text-xs text-foreground/60 mt-2">out of {studentQuizzes.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-foreground/60 mb-1">Average Score</p>
              <p className="text-3xl font-bold text-primary">{Math.round(totalScore)}%</p>
              <Progress value={totalScore} className="mt-3 h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-foreground/60 mb-1">Pending</p>
              <p className="text-3xl font-bold text-foreground">{studentQuizzes.filter(q => !q.completed).length}</p>
              <p className="text-xs text-foreground/60 mt-2">quizzes waiting</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quiz List */}
      <div className="space-y-4">
        {studentQuizzes.map((quiz) => (
          <Card key={quiz.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                {/* Quiz Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">{quiz.title}</h3>
                  <p className="text-sm text-foreground/60 mb-3">{quiz.class}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-foreground/60 mb-4">
                    <span className="flex items-center gap-1">
                      <span className="font-medium">{quiz.questions}</span> Questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{quiz.duration}</span> mins
                    </span>
                  </div>

                  {quiz.completed && (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-semibold">Completed {quiz.completedAt}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-bold text-primary">{quiz.score}%</span>
                        <span className="text-foreground/60 ml-1">Score</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="flex flex-col items-end gap-2">
                  {quiz.completed ? (
                    <Link href={`/quiz-review/${quiz.id}`}>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/student-quiz?mode=async&quiz=${quiz.id}`}>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                        <Play className="w-4 h-4" />
                        Start Quiz
                      </Button>
                    </Link>
                  )}
                  <Link href={`/live-quiz?mode=live&quiz=${quiz.id}`}>
                    <Button variant="outline" size="sm">
                      Live Mode
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
