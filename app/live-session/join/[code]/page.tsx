'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'

interface Question {
  id: number
  text: string
  options: string[]
}

export default function StudentLiveSessionPage() {
  const params = useParams()
  const [sessionState, setSessionState] = useState<'waiting' | 'question' | 'answered' | 'ended'>('waiting')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [studentName, setStudentName] = useState('Player')

  const questions: Question[] = [
    {
      id: 1,
      text: 'What is the powerhouse of the cell?',
      options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum']
    },
    {
      id: 2,
      text: 'How many bones are in the human body?',
      options: ['186', '206', '226', '246']
    },
    {
      id: 3,
      text: 'What is photosynthesis?',
      options: ['Breaking down glucose', 'Building glucose from sunlight', 'Storing energy', 'Moving water']
    },
  ]

  const colors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-400', 'bg-green-500']
  const buttonLabels = ['A', 'B', 'C', 'D']

  useEffect(() => {
    // Get student name from localStorage
    const sessionInfo = localStorage.getItem('sessionInfo')
    if (sessionInfo) {
      const info = JSON.parse(sessionInfo)
      setStudentName(info.studentName)
    }

    // Simulate session starting after 3 seconds
    const timer = setTimeout(() => {
      setSessionState('question')
      setTotalQuestions(questions.length)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleAnswerSelect = (index: number) => {
    if (sessionState !== 'question') return
    
    setSelectedAnswer(index)
    setSessionState('answered')

    // Award points if correct
    if (index === currentQuestion % 2) { // Simple logic: alternating correct answers
      setScore(score + 100)
    }

    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setSessionState('question')
      } else {
        setSessionState('ended')
      }
    }, 2000)
  }

  const handleLeaveSession = () => {
    localStorage.removeItem('sessionInfo')
    window.location.href = '/student-dashboard'
  }

  if (sessionState === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Joining Session...</h1>
          <p className="text-foreground/60">Session Code: <span className="font-bold text-primary">{params.code}</span></p>
          <p className="text-sm text-foreground/60 mt-4">Get ready for the quiz to start!</p>
        </div>
      </div>
    )
  }

  if (sessionState === 'ended') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="text-6xl font-bold text-primary mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Session Complete!</h1>
            <p className="text-foreground/60 mb-8">Great job, {studentName}!</p>
            
            <div className="bg-primary/10 rounded-lg p-6 mb-8">
              <p className="text-sm text-foreground/60 mb-2">Your Final Score</p>
              <p className="text-4xl font-bold text-primary">{score}</p>
              <p className="text-sm text-foreground/60 mt-2">Points Earned</p>
            </div>

            <Button
              onClick={handleLeaveSession}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-base font-semibold"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const quiz = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">{studentName}</h1>
            <p className="text-sm text-foreground/60 font-mono">{params.code}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{score} pts</p>
            <p className="text-xs text-foreground/60">Question {currentQuestion + 1} of {totalQuestions}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLeaveSession}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Leave
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Question */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            {quiz.text}
          </h2>

          {/* Answer Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {quiz.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isDisabled = sessionState !== 'question'
              
              let buttonClass = colors[index]
              if (isSelected && sessionState === 'answered') {
                buttonClass += ' ring-4 ring-white shadow-lg'
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isDisabled}
                  className={`${buttonClass} p-6 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-xl transition-all transform ${
                    !isDisabled ? 'hover:scale-105 cursor-pointer' : 'opacity-75'
                  } ${isSelected ? 'ring-4 ring-white' : ''}`}
                >
                  <span className="block text-sm mb-2">{buttonLabels[index]}</span>
                  {option}
                </button>
              )
            })}
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
