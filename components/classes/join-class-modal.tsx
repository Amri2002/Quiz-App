'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { classesApi } from '@/lib/api'

interface JoinClassModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClassJoined?: () => void
}

export function JoinClassModal({ open, onOpenChange, onClassJoined }: JoinClassModalProps) {
  const [joinCode, setJoinCode] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsJoining(true)
    setError('')
    setSuccess(false)
    
    try {
      // Remove dashes and spaces before sending to API
      const cleanCode = joinCode.replace(/[-\s]/g, '').trim()
      await classesApi.joinClass(cleanCode)
      setSuccess(true)
      
      // Wait a moment to show success, then close and refresh
      setTimeout(() => {
        setIsJoining(false)
        onOpenChange(false)
        onClassJoined?.()
        
        // Reset form
        setJoinCode('')
        setError('')
        setSuccess(false)
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to join class')
      setIsJoining(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Join a Class</DialogTitle>
          <DialogDescription>
            Enter the 6-character join code provided by your teacher.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-md">
              Successfully joined the class!
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="joinCode" className="text-sm font-semibold">
              Join Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="joinCode"
              placeholder="e.g., A7-9B-C3 or A79BC3"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              required
              disabled={isJoining || success}
              className="text-lg font-mono text-center tracking-wider"
              maxLength={8}
            />
            <p className="text-xs text-muted-foreground">
              The join code is case-insensitive and can be entered with or without dashes.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isJoining}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isJoining || !joinCode.trim() || success}>
              {isJoining ? 'Joining...' : success ? 'Joined!' : 'Join Class'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
