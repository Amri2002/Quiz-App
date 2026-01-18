'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, Zap } from 'lucide-react'

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correct: 2,
    explanation: 'Paris is the capital and largest city of France.',
  },
  {
    id: 2,
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correct: 1,
    explanation: 'Mars is often called the Red Planet due to its reddish color.',
  },
  {
    id: 3,
    question: 'What is the largest ocean on Earth?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    correct: 3,
    explanation: 'The Pacific Ocean is the largest and deepest ocean on Earth.',
  },
  {
    id: 4,
    question: 'Who wrote "Romeo and Juliet"?',
    options: ['Jane Austen', 'William Shakespeare', 'Charles Dickens', 'Mark Twain'],
    correct: 1,
    explanation: 'William Shakespeare wrote this famous tragedy in the 16th century.',
  },
  {
    id: 5,
    question: 'What is the chemical symbol for Gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correct: 2,
    explanation: 'Au is the chemical symbol for Gold, derived from its Latin name "Aurum".',
  },
]

interface QuizInterfaceProps {
  userName: string
}

export default function QuizInterface({ userName }: QuizInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [answered, setAnswered] = useState<{ questionId: number; answer: number; correct: boolean }[]>([])

  const handleAnswer = (optionIndex: number) => {
    if (!showResult) {
      setSelectedAnswer(optionIndex)
      const isCorrect = optionIndex === QUIZ_QUESTIONS[currentQuestion].correct
      setScore(isCorrect ? score + 1 : score)
      setAnswered([
        ...answered,
        {
          questionId: QUIZ_QUESTIONS[currentQuestion].id,
          answer: optionIndex,
          correct: isCorrect,
        },
      ])
      setShowResult(true)
    }
  }

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setQuizComplete(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setQuizComplete(false)
    setAnswered([])
  }

  const question = QUIZ_QUESTIONS[currentQuestion]
  const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100)

  if (quizComplete) {
    const performanceMessage =
      percentage >= 80
        ? '🎉 Excellent! You really know your stuff!'
        : percentage >= 60
          ? '👏 Good job! Keep it up!'
          : "📚 Nice try! Let's learn together!"

    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Complete!</CardTitle>
          <CardDescription>See how you performed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="text-6xl font-bold text-primary mb-2">{percentage}%</div>
              <div className="text-2xl font-semibold text-foreground mb-2">
                {score} out of {QUIZ_QUESTIONS.length} correct
              </div>
              <p className="text-lg text-foreground/60 mb-4">{performanceMessage}</p>
            </div>

            {/* Results Summary */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground mb-4">Review Your Answers</h3>
              {answered.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    result.correct
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.correct ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={`font-medium ${result.correct ? 'text-green-900' : 'text-red-900'}`}>
                        Question {result.questionId}
                      </p>
                      <p className="text-sm mt-1">
                        Your answer: <span className="font-semibold">{QUIZ_QUESTIONS[result.questionId - 1].options[result.answer]}</span>
                      </p>
                      {!result.correct && (
                        <p className="text-sm mt-1">
                          Correct answer: <span className="font-semibold text-green-700">
                            {QUIZ_QUESTIONS[result.questionId - 1].options[QUIZ_QUESTIONS[result.questionId - 1].correct]}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleRestart}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-2"
              >
                Retake Quiz
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-border text-foreground hover:bg-card bg-transparent"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>AI Knowledge Quiz</CardTitle>
            <CardDescription>Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{score}/{QUIZ_QUESTIONS.length}</div>
            <p className="text-xs text-foreground/60">Correct answers</p>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="mt-4 w-full bg-border rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          ></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-6">{question.question}</h3>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === question.correct
              const answered_correctly = showResult && isSelected && isCorrect
              const answered_incorrectly = showResult && isSelected && !isCorrect

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 text-left rounded-lg border-2 transition ${
                    answered_correctly
                      ? 'bg-green-50 border-green-500'
                      : answered_incorrectly
                        ? 'bg-red-50 border-red-500'
                        : showResult && isCorrect
                          ? 'bg-green-50 border-green-500'
                          : isSelected
                            ? 'bg-primary/10 border-primary'
                            : 'bg-card border-border hover:border-primary/50'
                  } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-medium ${
                        answered_correctly || (showResult && isCorrect)
                          ? 'text-green-900'
                          : answered_incorrectly
                            ? 'text-red-900'
                            : 'text-foreground'
                      }`}
                    >
                      {option}
                    </span>
                    {answered_correctly && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                    {answered_incorrectly && <XCircle className="w-5 h-5 text-red-600" />}
                    {showResult && isCorrect && !isSelected && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Explanation - Show after answering */}
        {showResult && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 mb-1">Explanation</p>
                <p className="text-sm text-blue-800">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Next Button */}
        {showResult && (
          <Button
            onClick={handleNext}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2"
          >
            {currentQuestion === QUIZ_QUESTIONS.length - 1 ? 'See Results' : 'Next Question'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
