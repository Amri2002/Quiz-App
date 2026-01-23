'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { classesApi } from '@/lib/api'

export default function JoinClassPage() {
  const router = useRouter()
  const [joinCode, setJoinCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!joinCode.trim()) {
      setError('Please enter a join code')
      return
    }

    setLoading(true)
    
    try {
      // Remove dashes before sending to API
      const cleanCode = joinCode.replace(/-/g, '')
      await classesApi.joinClass(cleanCode)
      // Redirect to student dashboard after successful join
      router.push('/student-dashboard')
    } catch (err: any) {
      console.error('Failed to join class:', err)
      setError(err.response?.data?.detail || 'Failed to join class. Please check the code and try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatJoinCode = (value: string) => {
    // Remove any non-alphanumeric characters
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    
    // Format as XX-XX-XX
    if (cleaned.length <= 2) {
      return cleaned
    } else if (cleaned.length <= 4) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`
    } else {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 6)}`
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatJoinCode(e.target.value)
    setJoinCode(formatted)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Join a Class</CardTitle>
          <CardDescription>
            Enter the 6-character code provided by your teacher
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleJoinClass} className="space-y-6">
            {/* Join Code Input */}
            <div className="space-y-2">
              <label htmlFor="joinCode" className="text-sm font-medium">
                Class Code
              </label>
              <Input
                id="joinCode"
                type="text"
                placeholder="XX-XX-XX"
                value={joinCode}
                onChange={handleInputChange}
                maxLength={8}
                className="text-center text-2xl font-mono tracking-wider uppercase"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground text-center">
                Format: 2 letters/numbers - 2 letters/numbers - 2 letters/numbers
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Join Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading || joinCode.length < 8}
            >
              {loading ? (
                'Joining...'
              ) : (
                <>
                  Join Class
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            {/* Back to Dashboard */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push('/student-dashboard')}
              disabled={loading}
            >
              Back to Dashboard
            </Button>
          </form>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have a code? Ask your teacher for the class join code.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
