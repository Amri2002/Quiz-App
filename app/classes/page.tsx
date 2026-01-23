'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Users, BookOpen, MoreVertical, Copy, Check, Archive, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreateClassModal } from '@/components/classes/create-class-modal'
import DashboardLayout from '@/components/dashboard-layout'
import { classesApi, ClassData } from '@/lib/api'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function ClassesPage() {
  const router = useRouter()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [classes, setClasses] = useState<ClassData[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user')
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
    
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const data = await classesApi.getMyClasses(false)
      setClasses(data)
    } catch (error) {
      console.error('Failed to fetch classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleArchiveClass = async (classId: number) => {
    try {
      await classesApi.updateClass(classId, { is_archived: true })
      fetchClasses()
    } catch (error) {
      console.error('Failed to archive class:', error)
    }
  }

  const handleDeleteClass = async (classId: number) => {
    if (!confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      return
    }
    
    try {
      await classesApi.deleteClass(classId)
      fetchClasses()
    } catch (error) {
      console.error('Failed to delete class:', error)
    }
  }

  const isTeacher = user?.userType === 'teacher'

  return (
    <DashboardLayout title="My Classes" subtitle="Manage your classrooms and students">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-end">
          {isTeacher && (
            <Button onClick={() => setIsCreateModalOpen(true)} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Class
            </Button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading classes...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && classes.length === 0 && (
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Classes Yet</h3>
            <p className="text-muted-foreground mb-6">
              {isTeacher 
                ? "Create your first class to get started with managing students and quizzes."
                : "Join a class using a code from your teacher."}
            </p>
            {isTeacher && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Class
              </Button>
            )}
          </Card>
        )}

        {/* Class Grid */}
        {!loading && classes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <Card 
                key={classItem.id}
                className="overflow-hidden hover:shadow-lg transition-all border-2 hover:border-primary/20 group cursor-pointer"
                onClick={() => router.push(`/classes/${classItem.id}`)}
              >
                {/* Cover Image */}
                <div className="h-32 bg-gradient-to-br from-primary/60 to-primary relative">
                  <div className="absolute inset-0 bg-black/20" />
                  {isTeacher && (
                    <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="bg-white/20 hover:bg-white/30 text-white"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            handleArchiveClass(classItem.id)
                          }}>
                            <Archive className="w-4 h-4 mr-2" />
                            Archive Class
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteClass(classItem.id)
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Class
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                  {classItem.is_archived && (
                    <Badge className="absolute top-3 left-3 bg-yellow-500">
                      Archived
                    </Badge>
                  )}
                </div>

                <CardContent className="p-6 space-y-4">
                  {/* Class Info */}
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      {classItem.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {classItem.description || 'No description'}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1.5" />
                      {classItem.student_count || 0} students
                    </div>
                  </div>

                  {/* Join Code */}
                  {isTeacher && (
                    <div className="pt-4 border-t" onClick={(e) => e.stopPropagation()}>
                      <p className="text-xs text-muted-foreground mb-2">Join Code</p>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 px-3 py-2 bg-muted rounded-md font-mono text-sm font-semibold">
                          {classItem.join_code}
                        </code>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyCode(classItem.join_code)
                          }}
                          className="shrink-0"
                        >
                          {copiedCode === classItem.join_code ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* View Button */}
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => router.push(`/classes/${classItem.id}`)}
                  >
                    View Class
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateClassModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen}
        onClassCreated={fetchClasses}
      />
    </DashboardLayout>
  )
}
