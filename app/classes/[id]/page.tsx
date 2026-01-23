'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, Users, BookOpen, Upload, FileText, Download, 
  Trash2, Calendar, User, X 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { classesApi, materialsApi, ClassDetail, StudyMaterial } from '@/lib/api'
import DashboardLayout from '@/components/dashboard-layout'

export default function ClassDetailPage() {
  const params = useParams()
  const router = useRouter()
  const classId = parseInt(params.id as string)
  
  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null)
  const [materials, setMaterials] = useState<StudyMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [isTeacher, setIsTeacher] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadDescription, setUploadDescription] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchClassData()
  }, [classId])

  const fetchClassData = async () => {
    try {
      setLoading(true)
      const [classData, materialsData] = await Promise.all([
        classesApi.getClassDetails(classId),
        materialsApi.getClassMaterials(classId)
      ])
      
      setClassDetail(classData)
      setMaterials(materialsData)
      
      // Check if current user is teacher
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        setIsTeacher(user.id === classData.teacher_id)
      }
    } catch (error) {
      console.error('Failed to fetch class data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadMaterial = async () => {
    if (!uploadFile || !uploadTitle.trim()) {
      alert('Please provide a file and title')
      return
    }

    setUploading(true)
    try {
      await materialsApi.uploadMaterial(classId, uploadFile, uploadTitle, uploadDescription)
      setUploadModalOpen(false)
      setUploadFile(null)
      setUploadTitle('')
      setUploadDescription('')
      fetchClassData()
    } catch (error) {
      console.error('Failed to upload material:', error)
      alert('Failed to upload material')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteMaterial = async (materialId: number) => {
    if (!confirm('Are you sure you want to delete this material?')) return

    try {
      await materialsApi.deleteMaterial(materialId)
      fetchClassData()
    } catch (error) {
      console.error('Failed to delete material:', error)
      alert('Failed to delete material')
    }
  }

  const handleRemoveStudent = async (studentId: number, studentName: string) => {
    if (!confirm(`Remove ${studentName} from this class?`)) return

    try {
      await classesApi.removeStudent(classId, studentId)
      fetchClassData()
    } catch (error) {
      console.error('Failed to remove student:', error)
      alert('Failed to remove student')
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    const mb = bytes / (1024 * 1024)
    if (mb < 1) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }
    return `${mb.toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <DashboardLayout title="Loading..." subtitle="">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading class details...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!classDetail) {
    return (
      <DashboardLayout title="Class Not Found" subtitle="">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-muted-foreground">Class not found</p>
          <Button onClick={() => router.push('/classes')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Classes
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      title={classDetail.name}
      subtitle={classDetail.description || 'Class Details'}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push('/classes')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Classes
          </Button>
          
          {isTeacher && (
            <Button onClick={() => setUploadModalOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Material
            </Button>
          )}
        </div>

        {/* Class Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Class Information</CardTitle>
                <CardDescription>Join Code: {classDetail.join_code}</CardDescription>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {classDetail.students.length} students
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {materials.length} materials
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Study Materials */}
        <Card>
          <CardHeader>
            <CardTitle>Study Materials</CardTitle>
            <CardDescription>
              {isTeacher ? 'Uploaded materials for this class' : 'Materials shared by your teacher'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {materials.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No materials uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-3 flex-1">
                      <FileText className="w-5 h-5 text-blue-600 mt-1" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{material.title}</h4>
                        {material.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {material.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {material.uploader_name}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(material.created_at)}
                          </span>
                          <span>{formatFileSize(material.file_size)}</span>
                          {material.file_type && (
                            <span className="uppercase">{material.file_type}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`http://localhost:8000${material.file_url}`, '_blank')}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      {isTeacher && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMaterial(material.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enrolled Students (Teacher Only) */}
        {isTeacher && (
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
              <CardDescription>{classDetail.students.length} students enrolled</CardDescription>
            </CardHeader>
            <CardContent>
              {classDetail.students.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No students enrolled yet</p>
                  <p className="text-sm mt-2">Share the join code: {classDetail.join_code}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {classDetail.students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{student.username}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Joined: {formatDate(student.enrolled_at)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveStudent(student.id, student.username)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upload Material Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Study Material</DialogTitle>
            <DialogDescription>
              Upload a file to share with your students
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">File</label>
              <Input
                type="file"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                disabled={uploading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="e.g., Lecture Notes - Week 1"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                disabled={uploading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optional)</label>
              <Textarea
                placeholder="Add a description..."
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                disabled={uploading}
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setUploadModalOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button onClick={handleUploadMaterial} disabled={uploading || !uploadFile || !uploadTitle.trim()}>
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
