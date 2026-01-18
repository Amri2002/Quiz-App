'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard-layout'
import MaterialUpload from '@/components/material-upload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'

type Step = 'upload' | 'select' | 'config' | 'preview'

interface GeneratedQuestion {
  id: string
  text: string
  type: 'mcq' | 'essay' | 'short'
  options?: string[]
  correctAnswer?: string
}

const DEMO_QUESTIONS: GeneratedQuestion[] = [
  {
    id: '1',
    text: 'What is the primary function of mitochondria?',
    type: 'mcq',
    options: ['Protein synthesis', 'Energy production (ATP)', 'DNA replication', 'Cell division'],
    correctAnswer: 'Energy production (ATP)'
  },
  {
    id: '2',
    text: 'Explain the process of photosynthesis',
    type: 'essay'
  },
  {
    id: '3',
    text: 'What is the chemical formula for glucose?',
    type: 'short',
    correctAnswer: 'C6H12O6'
  },
]

export default function QuizGenerator() {
  const [step, setStep] = useState<Step>('upload')
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [questionType, setQuestionType] = useState<string>('mixed')
  const [difficulty, setDifficulty] = useState<string>('medium')
  const [numQuestions, setNumQuestions] = useState<string>('10')
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [editingQuestion, setEditingQuestion] = useState<GeneratedQuestion | null>(null)

  const materials = [
    { id: '1', name: 'Biology_Chapter3.pdf' },
    { id: '2', name: 'Cell Biology Lecture - YouTube' },
    { id: '3', name: 'Genetics Overview - Website' },
  ]

  const handleMaterialToggle = (id: string) => {
    setSelectedMaterials(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  const handleGenerateQuiz = () => {
    // Simulate quiz generation
    setGeneratedQuestions(DEMO_QUESTIONS)
    setStep('preview')
  }

  const handleDeleteQuestion = (id: string) => {
    setGeneratedQuestions(prev => prev.filter(q => q.id !== id))
  }

  const handleSaveQuestion = (question: GeneratedQuestion) => {
    setGeneratedQuestions(prev =>
      prev.map(q => q.id === question.id ? question : q)
    )
    setEditingQuestion(null)
  }

  const steps: { id: Step; label: string; description: string }[] = [
    { id: 'upload', label: 'Upload Materials', description: 'Add your course materials' },
    { id: 'select', label: 'Select Sources', description: 'Choose materials for quiz' },
    { id: 'config', label: 'Configuration', description: 'Set quiz parameters' },
    { id: 'preview', label: 'Preview & Publish', description: 'Review and publish quiz' },
  ]

  return (
    <DashboardLayout title="Quiz Generation Wizard" subtitle="Create AI-powered quizzes from your materials">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((s, idx) => (
            <div key={s.id} className="flex items-center flex-1">
              <button
                onClick={() => step !== 'preview' && setStep(s.id)}
                className={`w-12 h-12 rounded-full font-bold flex items-center justify-center transition ${
                  step === s.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-foreground/10 text-foreground'
                }`}
              >
                {steps.findIndex(x => x.id === step) > idx ? <Check className="w-5 h-5" /> : idx + 1}
              </button>
              <div className="ml-4">
                <p className="font-semibold text-foreground">{s.label}</p>
                <p className="text-sm text-foreground/60">{s.description}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-1 mx-4 flex-1 rounded ${step !== s.id ? 'bg-foreground/10' : 'bg-primary'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      {step === 'upload' && <MaterialUpload />}

      {/* Select Sources */}
      {step === 'select' && (
        <Card>
          <CardHeader>
            <CardTitle>Select Source Materials</CardTitle>
            <CardDescription>Choose which materials to generate questions from</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {materials.map(material => (
              <div key={material.id} className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-foreground/2">
                <Checkbox
                  checked={selectedMaterials.includes(material.id)}
                  onCheckedChange={() => handleMaterialToggle(material.id)}
                />
                <label className="flex-1 font-medium text-foreground cursor-pointer">
                  {material.name}
                </label>
              </div>
            ))}
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep('upload')}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => selectedMaterials.length > 0 && setStep('config')}
                disabled={selectedMaterials.length === 0}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration */}
      {step === 'config' && (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Configuration</CardTitle>
            <CardDescription>Set parameters for your quiz</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Question Type</label>
              <Select value={questionType} onValueChange={setQuestionType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq">Multiple Choice (MCQ)</SelectItem>
                  <SelectItem value="essay">Essay</SelectItem>
                  <SelectItem value="short">Short Answer</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Difficulty Level</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Number of Questions</label>
              <Select value={numQuestions} onValueChange={setNumQuestions}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Questions</SelectItem>
                  <SelectItem value="10">10 Questions</SelectItem>
                  <SelectItem value="15">15 Questions</SelectItem>
                  <SelectItem value="20">20 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 mt-8">
              <Button variant="outline" onClick={() => setStep('select')}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleGenerateQuiz}
              >
                Generate Quiz
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview & Publish */}
      {step === 'preview' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Questions</CardTitle>
              <CardDescription>Review and edit questions before publishing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {generatedQuestions.map(question => (
                <div key={question.id} className="border border-border rounded-lg p-6 space-y-4">
                  {editingQuestion?.id === question.id ? (
                    <div className="space-y-4">
                      <Textarea
                        value={editingQuestion.text}
                        onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                        className="min-h-24"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveQuestion(editingQuestion)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingQuestion(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm font-semibold text-foreground/60 mb-2">
                          {question.type.toUpperCase()}
                        </p>
                        <p className="font-semibold text-foreground text-lg">{question.text}</p>
                      </div>
                      {question.options && (
                        <div className="space-y-2">
                          {question.options.map((opt, idx) => (
                            <p key={idx} className={`p-2 rounded ${opt === question.correctAnswer ? 'bg-green-100 text-green-700' : 'bg-foreground/5'}`}>
                              {opt}
                            </p>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingQuestion(question)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              <div className="flex gap-3 mt-8">
                <Button variant="outline" onClick={() => setStep('config')}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90">
                  Publish Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
