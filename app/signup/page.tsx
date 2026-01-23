'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users } from 'lucide-react'
import { authApi } from '@/lib/api'

export default function SignupPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<'teacher' | 'student' | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validation
    if (!formData.name || !formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      setIsLoading(false)
      return
    }

    try {
      // Register with backend API
      await authApi.signup({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        full_name: formData.name,
        is_teacher: userType === 'teacher'
      })

      // Auto-login after signup
      const loginResponse = await authApi.login(formData.email, formData.password)
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
      router.push(user.is_teacher ? '/dashboard' : '/student-dashboard')
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.')
      setIsLoading(false)
    }
  }

  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-2">
              <Link href="/" className="text-foreground hover:text-primary">
                QuizLab
              </Link>
            </CardTitle>
            <CardDescription className="text-base">I am a...</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <button
              onClick={() => setUserType('teacher')}
              className="w-full p-6 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition text-left"
            >
              <div className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Teacher</h3>
                  <p className="text-sm text-foreground/60">Create classes and generate quizzes</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setUserType('student')}
              className="w-full p-6 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition text-left"
            >
              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Student</h3>
                  <p className="text-sm text-foreground/60">Take quizzes and track progress</p>
                </div>
              </div>
            </button>

            <div className="pt-2 text-center text-sm text-foreground/60">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-primary/80 font-semibold">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
          <CardDescription className="text-base">Create your {userType} account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className="border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="johndoe123"
                value={formData.username}
                onChange={handleChange}
                className="border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password (min 8 characters)
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="border-border"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 font-semibold"
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-foreground/60">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-primary/80 font-semibold">
              Log in
            </Link>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="w-full mt-4"
            onClick={() => setUserType(null)}
          >
            Back to Role Selection
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
