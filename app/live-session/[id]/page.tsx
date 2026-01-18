'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronRight, X } from 'lucide-react'

interface Question {
  id: number
  text: string
  options: string[]
  correct: number
}

export default function LiveSessionHostPage() {
  const params = useParams()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [sessionCode, setSessionCode] = useState('LIVE123')
  const [participantCount, setParticipantCount] = useState(8)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})

  const questions: Question[] = [
    {
      id: 1,
      text: 'What is the powerhouse of the cell?',
      options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'],
      correct: 1
    },
    {
      id: 2,
      text: 'How many bones are in the human body?',
      options: ['186', '206', '226', '246'],
      correct: 1
    },
    {
      id: 3,
      text: 'What is photosynthesis?',
      options: ['Breaking down glucose', 'Building glucose from sunlight', 'Storing energy', 'Moving water'],
      correct: 1
    },
  ]

  const quiz = questions[currentQuestion]
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-400', 'bg-green-500']
  const buttonLabels = ['A', 'B', 'C', 'D']

  useEffect(() => {
    // Simulate participants joining
    const interval = setInterval(() => {
      setParticipantCount(prev => Math.min(prev + Math.random() > 0.7 ? 1 : 0, 25))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQuestion]: index }))
    setShowResults(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowResults(false)
    } else {
      handleEndSession()
    }
  }

  const handleEndSession = () => {
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Live Session Host</h1>
            <p className="text-sm text-foreground/60">Session Code: <span className="font-bold text-primary">{sessionCode}</span></p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">{Math.round(participantCount)} Students Connected</p>
            <p className="text-xs text-foreground/60">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <X className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Question */}
        <div className="mb-12">
          <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-balance">
              {quiz.text}
            </h2>

            {/* Answer Buttons Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {quiz.options.map((option, index) => {
                const isSelected = selectedAnswers[currentQuestion] === index
                const isCorrect = index === quiz.correct
                let buttonClass = colors[index]

                if (showResults) {
                  if (isCorrect) {
                    buttonClass = 'bg-green-500 ring-4 ring-green-300'
                  } else if (isSelected && !isCorrect) {
                    buttonClass = 'bg-red-500 ring-4 ring-red-300'
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => !showResults && handleAnswerSelect(index)}
                    disabled={showResults}
                    className={`${buttonClass} p-8 rounded-xl font-bold text-white text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:cursor-default ${
                      isSelected && !showResults ? 'ring-4 ring-white' : ''
                    }`}
                  >
                    <span className="block text-sm mb-2">{buttonLabels[index]}</span>
                    {option}
                  </button>
                )
              })}
            </div>

            {/* Results Display */}
            {showResults && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8 animate-in fade-in">
                <p className="text-center font-semibold text-foreground">
                  {selectedAnswers[currentQuestion] === quiz.correct
                    ? '✓ Correct! Great job!'
                    : '✗ Incorrect. The correct answer is: ' + quiz.options[quiz.correct]}
                </p>
              </div>
            )}

            {/* Timer & Progress */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {showResults && (
              <Button
                onClick={handleNextQuestion}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-base font-semibold"
              >
                {currentQuestion < questions.length - 1 ? (
                  <>Next Question <ChevronRight className="w-4 h-4 ml-2" /></>
                ) : (
                  'End Session'
                )}
              </Button>
            )}
          </div>

          {/* Leaderboard Preview */}
          <Card className="bg-card/50">
            <CardContent className="pt-6">
              <h3 className="font-bold text-foreground mb-4">Top Performers</h3>
              <div className="space-y-3">
                {[
                  { name: 'Alice J.', score: 900 },
                  { name: 'Bob S.', score: 850 },
                  { name: 'Carol D.', score: 800 }
                ].map((player, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">#{idx + 1}</span>
                      <span className="text-sm text-foreground">{player.name}</span>
                    </div>
                    <span className="font-bold text-foreground">{player.score}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
