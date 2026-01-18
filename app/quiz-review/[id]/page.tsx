'use client'

import Link from 'next/link'
import DashboardLayout from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, MessageSquare } from 'lucide-react'

interface ReviewQuestion {
  id: string
  text: string
  type: 'mcq' | 'essay'
  studentAnswer: string
  correctAnswer: string
  isCorrect: boolean
  options?: string[]
  feedback?: string
}

const REVIEW_QUESTIONS: ReviewQuestion[] = [
  {
    id: '1',
    text: 'What is the primary function of mitochondria?',
    type: 'mcq',
    studentAnswer: 'Energy production (ATP)',
    correctAnswer: 'Energy production (ATP)',
    isCorrect: true,
    options: ['Protein synthesis', 'Energy production (ATP)', 'DNA replication', 'Cell division'],
    feedback: 'Excellent! You correctly identified the main role of mitochondria as the powerhouse of the cell.'
  },
  {
    id: '2',
    text: 'Which organelle contains the cell\'s genetic material?',
    type: 'mcq',
    studentAnswer: 'Mitochondria',
    correctAnswer: 'Nucleus',
    isCorrect: false,
    options: ['Ribosome', 'Nucleus', 'Mitochondria', 'Golgi apparatus'],
    feedback: 'Not quite. While mitochondria has its own DNA, the main genetic material (chromosomes) is stored in the nucleus.'
  },
  {
    id: '3',
    text: 'Explain the photosynthesis process in detail',
    type: 'essay',
    studentAnswer: 'Photosynthesis is when plants use sunlight to make food. It happens in two stages: light reactions and dark reactions. In light reactions, light energy is converted to chemical energy (ATP and NADPH). In dark reactions (Calvin cycle), CO2 is converted into glucose using the ATP and NADPH from light reactions.',
    correctAnswer: 'Expected: Plants use sunlight to convert CO2 and water into glucose and oxygen. This occurs in two stages...',
    isCorrect: true,
    feedback: 'Great explanation! You understood the two main stages and the flow of energy. For next time, try to mention the role of chlorophyll in capturing light energy.'
  },
]

export default function QuizReviewPage({ params }: { params: { id: string } }) {
  const score = 66 // 2 out of 3 questions correct

  return (
    <DashboardLayout title="Quiz Review" subtitle="Review your answers and feedback" role="student">
      {/* Score Summary */}
      <Card className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="pt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-foreground/60 mb-2">Final Score</p>
              <p className="text-5xl font-bold text-primary">{score}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-foreground/60 mb-4">Performance</p>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-green-600">✓ 2 Correct</p>
                <p className="text-lg font-semibold text-destructive">✗ 1 Incorrect</p>
              </div>
            </div>
          </div>
          <Link href="/student-dashboard">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Back to Quizzes
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Questions Review */}
      <div className="space-y-6">
        {REVIEW_QUESTIONS.map((question, idx) => (
          <Card key={question.id} className={question.isCorrect ? 'border-l-4 border-l-green-600' : 'border-l-4 border-l-destructive'}>
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <CardTitle className="flex items-center gap-2 mb-2">
                    Question {idx + 1}: {question.type === 'mcq' ? 'Multiple Choice' : 'Essay'}
                    {question.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </CardTitle>
                  <p className="font-semibold text-foreground">{question.text}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* MCQ Options */}
              {question.type === 'mcq' && question.options && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground/60">All Options:</p>
                  {question.options.map((option, idx) => {
                    const isStudentAnswer = option === question.studentAnswer
                    const isCorrectAnswer = option === question.correctAnswer
                    
                    let bgColor = 'bg-foreground/2'
                    if (isCorrectAnswer) bgColor = 'bg-green-100'
                    if (isStudentAnswer && !isCorrectAnswer) bgColor = 'bg-destructive/10'
                    
                    return (
                      <div key={idx} className={`p-3 rounded-lg ${bgColor}`}>
                        <p className="font-medium text-foreground">
                          {option}
                          {isCorrectAnswer && <span className="text-green-600 ml-2">✓ Correct</span>}
                          {isStudentAnswer && !isCorrectAnswer && <span className="text-destructive ml-2">✗ Your answer</span>}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Essay Answers */}
              {question.type === 'essay' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground/60 mb-2">Your Answer:</p>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-foreground">{question.studentAnswer}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground/60 mb-2">Expected Answer:</p>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-foreground">{question.correctAnswer}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Feedback */}
              {question.feedback && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">AI Feedback</p>
                      <p className="text-foreground/70">{question.feedback}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
