'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'

export default function JoinSessionPage() {
  const router = useRouter()
  const [sessionCode, setSessionCode] = useState('')
  const [studentName, setStudentName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!sessionCode.trim() || !studentName.trim()) {
      setError('Please enter both session code and your name')
      return
    }

    setLoading(true)
    try {
      // Simulate joining session
      setTimeout(() => {
        // Store session info
        localStorage.setItem('sessionInfo', JSON.stringify({
          code: sessionCode.toUpperCase(),
          studentName: studentName,
          joinedAt: new Date().toISOString()
        }))
        router.push(`/live-session/join/${sessionCode.toUpperCase()}`)
      }, 500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-foreground">
            QuizLab
          </Link>
          <h1 className="text-2xl font-bold text-foreground mt-4">Join Live Session</h1>
          <p className="text-foreground/60 mt-2">Enter the session code your teacher provided</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
            <CardDescription>Get ready for an interactive quiz</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoinSession} className="space-y-4">
              {error && (
                <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div>
                <Label htmlFor="sessionCode" className="text-foreground font-semibold">Session Code</Label>
                <Input
                  id="sessionCode"
                  placeholder="e.g., LIVE123"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                  className="mt-2 text-center text-lg tracking-widest font-bold"
                  maxLength={6}
                />
              </div>

              <div>
                <Label htmlFor="name" className="text-foreground font-semibold">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-base font-semibold"
              >
                {loading ? 'Joining...' : 'Join Session'}
              </Button>
            </form>

            <p className="text-xs text-foreground/60 text-center mt-4">
              Don't have a session code? Ask your teacher
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
