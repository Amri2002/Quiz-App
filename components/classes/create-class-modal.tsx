'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Copy, Check, Sparkles } from 'lucide-react'

interface CreateClassModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateClassModal({ open, onOpenChange }: CreateClassModalProps) {
  const [className, setClassName] = useState('')
  const [subject, setSubject] = useState('')
  const [grade, setGrade] = useState('')
  const [schedule, setSchedule] = useState('')
  const [description, setDescription] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const generateJoinCode = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    const part1 = Array.from({ length: 4 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('')
    const part2 = Array.from({ length: 2 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('')
    return `${part1}-${part2}`
  }

  const handleGenerateCode = () => {
    setJoinCode(generateJoinCode())
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(joinCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log('Class created:', {
        className,
        subject,
        grade,
        schedule,
        description,
        joinCode
      })
      setIsCreating(false)
      onOpenChange(false)
      // Reset form
      setClassName('')
      setSubject('')
      setGrade('')
      setSchedule('')
      setDescription('')
      setJoinCode('')
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Class</DialogTitle>
          <DialogDescription>
            Set up a new class for your students. Generate a unique join code that students will use to enroll.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Class Name */}
          <div className="space-y-2">
            <Label htmlFor="className" className="text-sm font-semibold">
              Class Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="className"
              placeholder="e.g., Biology 101"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
              className="text-base"
            />
          </div>

          {/* Subject & Grade */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-semibold">
                Subject <span className="text-destructive">*</span>
              </Label>
              <Select value={subject} onValueChange={setSubject} required>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade" className="text-sm font-semibold">
                Grade Level <span className="text-destructive">*</span>
              </Label>
              <Select value={grade} onValueChange={setGrade} required>
                <SelectTrigger id="grade">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">Grade 6</SelectItem>
                  <SelectItem value="7">Grade 7</SelectItem>
                  <SelectItem value="8">Grade 8</SelectItem>
                  <SelectItem value="9">Grade 9</SelectItem>
                  <SelectItem value="10">Grade 10</SelectItem>
                  <SelectItem value="11">Grade 11</SelectItem>
                  <SelectItem value="12">Grade 12</SelectItem>
                  <SelectItem value="college">College</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-2">
            <Label htmlFor="schedule" className="text-sm font-semibold">
              Schedule
            </Label>
            <Input
              id="schedule"
              placeholder="e.g., Mon, Wed, Fri - 9:00 AM"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="text-base"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Brief description of the class..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Join Code Generation */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              Join Code <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                value={joinCode}
                readOnly
                placeholder="Click generate to create code"
                className="font-mono text-lg font-bold text-center tracking-wider"
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateCode}
                className="shrink-0"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate
              </Button>
              {joinCode && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyCode}
                  className="shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              )}
            </div>
            <p className="text-xs text-foreground/60">
              Students will use this code to join your class
            </p>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!className || !subject || !grade || !joinCode || isCreating}
            className="bg-primary"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating...
              </>
            ) : (
              'Create Class'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
