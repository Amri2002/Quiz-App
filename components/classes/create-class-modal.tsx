'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Copy, Check } from 'lucide-react'
import { classesApi } from '@/lib/api'

interface CreateClassModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClassCreated?: () => void
}

export function CreateClassModal({ open, onOpenChange, onClassCreated }: CreateClassModalProps) {
  const [className, setClassName] = useState('')
  const [description, setDescription] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  const handleCopyCode = () => {
    navigator.clipboard.writeText(joinCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    setError('')
    
    try {
      const response = await classesApi.createClass({
        name: className,
        description: description || undefined
      })
      
      setJoinCode(response.join_code)
      
      // Wait a moment to show the join code, then close and refresh
      setTimeout(() => {
        setIsCreating(false)
        onOpenChange(false)
        onClassCreated?.()
        
        // Reset form
        setClassName('')
        setDescription('')
        setJoinCode('')
        setError('')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to create class')
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Class</DialogTitle>
          <DialogDescription>
            Set up a new class for your students. A unique join code will be generated automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          {/* Class Name */}
          <div className="space-y-2">
            <Label htmlFor="className" className="text-sm font-semibold">
              Class Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="className"
              placeholder="e.g., CS101 - Intro to AI"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
              disabled={isCreating}
              className="text-base"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Brief description of the class..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isCreating}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Join Code Display */}
          {joinCode && (
            <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary/20 space-y-2">
              <Label className="text-sm font-semibold text-primary">
                Join Code Created!
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  value={joinCode}
                  readOnly
                  className="text-lg font-mono font-bold text-center bg-background"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={handleCopyCode}
                  className="shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this code with your students to let them join the class.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !className.trim()}>
              {isCreating ? 'Creating...' : joinCode ? 'Close' : 'Create Class'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
