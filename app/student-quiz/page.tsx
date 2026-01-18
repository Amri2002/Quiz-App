'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import DashboardLayout from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { Suspense } from 'react'
import Loading from './loading'

interface Question {
  id: string
  text: string
  options: string[]
  type: 'mcq' | 'essay'
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: '1',
    text: 'What is the primary function of mitochondria?',
    options: ['Protein synthesis', 'Energy production (ATP)', 'DNA replication', 'Cell division'],
    type: 'mcq'
  },
  {
    id: '2',
    text: 'Which organelle contains the cell\'s genetic material?',
    options: ['Ribosome', 'Nucleus', 'Mitochondria', 'Golgi apparatus'],
    type: 'mcq'
  },
  {
    id: '3',
    text: 'What is the process by which plants make their own food?',
    options: ['Respiration', 'Photosynthesis', 'Fermentation', 'Digestion'],
    type: 'mcq'
  },
]

export default function StudentQuiz() {
  const searchParams = useSearchParams()
  const mode = (searchParams.get('mode') as 'async' | 'live') || 'async'
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes per question
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNextQuestion()
          return 180
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [currentQuestion])

  const handleSelectAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [QUIZ_QUESTIONS[currentQuestion].id]: answer
    }))
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setTimeLeft(180)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setTimeLeft(180)
    }
  }

  const handleSubmitQuiz = () => {
    // Calculate score (simple: 1 point per correct answer)
    let correctCount = 0
    QUIZ_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.options[1]) { // Second option is correct in this demo
        correctCount++
      }
    })
    setScore((correctCount / QUIZ_QUESTIONS.length) * 100)
    setIsSubmitted(true)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100

  if (isSubmitted) {
    return (
      <DashboardLayout title="Quiz Completed!" subtitle="Great job!">
        <Card>
          <CardContent className="pt-12 text-center space-y-6">
            <div>
              <p className="text-6xl font-bold text-primary mb-2">{Math.round(score)}%</p>
              <p className="text-xl text-foreground/60">Your Score</p>
            </div>

            <div className="grid grid-cols-3 gap-4 my-8">
              <div className="p-4 bg-green-100 rounded-lg">
                <p className="text-sm text-green-700">Correct</p>
                <p className="text-2xl font-bold text-green-700">{Math.round((score / 100) * QUIZ_QUESTIONS.length)}</p>
              </div>
              <div className="p-4 bg-red-100 rounded-lg">
                <p className="text-sm text-red-700">Incorrect</p>
                <p className="text-2xl font-bold text-red-700">{QUIZ_QUESTIONS.length - Math.round((score / 100) * QUIZ_QUESTIONS.length)}</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-primary">Total</p>
                <p className="text-2xl font-bold text-primary">{QUIZ_QUESTIONS.length}</p>
              </div>
            </div>

            <div className="space-y-2 flex gap-4 justify-center">
              <Button variant="outline">Review Answers</Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Take Another Quiz</Button>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  // Async Mode - Distraction-free focused view
  if (mode === 'async') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Fixed Top Bar with Timer */}
        <div className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
          <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-foreground/60">
                Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
              </p>
              <Progress value={progress} className="w-64 h-2 mt-2" />
            </div>
            <div className={`flex items-center gap-3 px-6 py-3 rounded-lg border-2 ${
              timeLeft < 60 
                ? 'bg-red-50 border-red-300 text-red-700' 
                : timeLeft < 120
                ? 'bg-orange-50 border-orange-300 text-orange-700'
                : 'bg-primary/10 border-primary/30 text-primary'
            }`}>
              <Clock className="w-6 h-6 animate-pulse" />
              <span className="text-3xl font-bold tabular-nums">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Question Content - Centered */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            {/* Question Card */}
            <Card className="mb-8">
              <CardContent className="pt-12 pb-8">
                <h2 className="text-3xl font-bold text-foreground mb-8">
                  {QUIZ_QUESTIONS[currentQuestion].text}
                </h2>

                {/* Answer Options */}
                <div className="space-y-3">
                  {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(option)}
                      className={`w-full p-4 text-left border-2 rounded-lg transition font-medium ${
                        answers[QUIZ_QUESTIONS[currentQuestion].id] === option
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-foreground/2 text-foreground hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answers[QUIZ_QUESTIONS[currentQuestion].id] === option
                            ? 'border-primary bg-primary'
                            : 'border-foreground/30'
                        }`}>
                          {answers[QUIZ_QUESTIONS[currentQuestion].id] === option && (
                            <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                          )}
                        </div>
                        {option}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentQuestion < QUIZ_QUESTIONS.length - 1 ? (
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleNextQuestion}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleSubmitQuiz}
                >
                  Submit Quiz
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Live Mode - Kahoot-style with colorful buttons
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Question */}
        <div className="text-center mb-12">
          <p className="text-white/80 text-lg mb-2">Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</p>
          <h2 className="text-5xl font-bold text-white">
            {QUIZ_QUESTIONS[currentQuestion].text}
          </h2>
          <div className="mt-6 text-white text-2xl font-bold">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Answer Options - Colorful Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => {
            const colors = [
              'bg-red-500 hover:bg-red-600',
              'bg-blue-500 hover:bg-blue-600',
              'bg-yellow-500 hover:bg-yellow-600',
              'bg-green-500 hover:bg-green-600',
            ]
            return (
              <button
                key={idx}
                onClick={() => {
                  handleSelectAnswer(option)
                  // Auto-next after selection in live mode
                  setTimeout(() => {
                    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
                      handleNextQuestion()
                    } else {
                      handleSubmitQuiz()
                    }
                  }, 800)
                }}
                className={`p-8 rounded-xl text-white font-bold text-2xl transition transform hover:scale-105 ${colors[idx]}`}
              >
                {option}
              </button>
            )
          })}
        </div>

        {/* Live Score */}
        <div className="text-center text-white">
          <p className="text-xl">Your Score: <span className="text-3xl font-bold">{Math.round((currentQuestion / QUIZ_QUESTIONS.length) * 100)}</span></p>
        </div>
      </div>
    </div>
  )
}

export function Loading() {
  return null
}
