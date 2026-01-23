'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authApi } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    try {
      // Login with backend API
      const loginResponse = await authApi.login(email, password)
      
      // Get user details
      const user = await authApi.getCurrentUser()
      
      // Store user data
      localStorage.setItem('user', JSON.stringify({
        email: user.email,
        name: user.full_name || user.username,
        userType: user.is_teacher ? 'teacher' : 'student',
        id: user.id,
        username: user.username
      }))
      
      // Redirect based on user type
      if (user.is_teacher) {
        router.push('/dashboard')
      } else {
        router.push('/student-dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-2">
            <Link href="/" className="text-foreground hover:text-primary">
              QuizLab
            </Link>
          </CardTitle>
          <CardDescription className="text-base">Welcome back</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-border"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 font-semibold"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-foreground/60">
            Do not have an account?{' '}
            <Link href="/signup" className="text-primary hover:text-primary/80 font-semibold">
              Sign up
            </Link>
          </div>

          {/* Test Credentials */}
          <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-xs font-semibold text-foreground mb-3">Demo Credentials:</p>
            <div className="space-y-3 text-xs">
              <div>
                <p className="font-semibold text-foreground mb-1">Teacher Account:</p>
                <div className="space-y-0.5 text-foreground/70 ml-2">
                  <p><span className="font-semibold">Email:</span> teacher@quiz.com</p>
                  <p><span className="font-semibold">Password:</span> teacher123</p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Student Account:</p>
                <div className="space-y-0.5 text-foreground/70 ml-2">
                  <p><span className="font-semibold">Email:</span> student@quiz.com</p>
                  <p><span className="font-semibold">Password:</span> student123</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
