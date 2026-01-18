'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Users, BookOpen, MoreVertical, Copy, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreateClassModal } from '@/components/classes/create-class-modal'
import DashboardLayout from '@/components/dashboard-layout'

const mockClasses = [
  {
    id: 1,
    name: 'Biology 101',
    description: 'Introduction to Biology',
    students: 28,
    quizzes: 5,
    joinCode: 'BIO1-A3',
    color: 'from-green-500 to-emerald-500',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400',
  },
  {
    id: 2,
    name: 'Chemistry 201',
    description: 'Advanced Chemistry Concepts',
    students: 32,
    quizzes: 8,
    joinCode: 'CHEM-B7',
    color: 'from-blue-500 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400',
  },
  {
    id: 3,
    name: 'Physics 301',
    description: 'Mechanics and Motion',
    students: 25,
    quizzes: 6,
    joinCode: 'PHY3-C9',
    color: 'from-purple-500 to-pink-500',
    image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400',
  },
  {
    id: 4,
    name: 'Math Algebra',
    description: 'Algebraic Expressions',
    students: 30,
    quizzes: 12,
    joinCode: 'MATH-D2',
    color: 'from-orange-500 to-red-500',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
  },
]

export default function ClassesPage() {
  const router = useRouter()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/login')
      return
    }
    
    const userData = JSON.parse(storedUser)
    if (userData.userType === 'student') {
      router.push('/student-dashboard')
    }
  }, [router])

  const copyJoinCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <DashboardLayout title="My Classes" subtitle="Manage your classrooms and students">
      <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-end">
        <Button onClick={() => setIsCreateModalOpen(true)} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Create Class
        </Button>
      </div>

      {/* Class Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockClasses.map((classItem) => (
          <Card 
            key={classItem.id}
            className="overflow-hidden hover:shadow-lg transition-all border-2 hover:border-blue-200 group"
          >
            {/* Cover Image */}
            <div className={`h-32 bg-gradient-to-br ${classItem.color} relative`}>
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute top-3 right-3">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="bg-white/20 hover:bg-white/30 text-white"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              {/* Class Info */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {classItem.name}
                </h3>
                <p className="text-sm text-gray-600">{classItem.description}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1.5" />
                  {classItem.students} students
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1.5" />
                  {classItem.quizzes} quizzes
                </div>
              </div>

              {/* Join Code */}
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2 font-mono text-sm font-semibold text-gray-900">
                  {classItem.joinCode}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyJoinCode(classItem.joinCode)}
                >
                  {copiedCode === classItem.joinCode ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Actions */}
              <Button className="w-full" variant="outline">
                Manage Class
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Add New Class Card */}
        <Card 
          className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer group"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <CardContent className="h-full flex flex-col items-center justify-center p-6 min-h-[300px]">
            <div className="w-16 h-16 bg-gray-100 group-hover:bg-blue-50 rounded-full flex items-center justify-center mb-4 transition-colors">
              <Plus className="w-8 h-8 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Create New Class</h3>
            <p className="text-sm text-gray-600 text-center">
              Set up a new classroom for your students
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create Class Modal */}
      <CreateClassModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      </div>
    </DashboardLayout>
  )
}
