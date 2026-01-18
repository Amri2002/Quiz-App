'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  FileText, 
  Video, 
  Globe, 
  CheckCircle, 
  AlertCircle, 
  Loader,
  Trash2,
  Download,
  Eye,
  Search,
  Filter
} from 'lucide-react'

interface Material {
  id: string
  name: string
  type: 'pdf' | 'docx' | 'ppt' | 'youtube' | 'website' | 'image'
  status: 'processing' | 'ready' | 'error'
  uploadedAt: string
  size?: string
  embeddings?: number
}

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'processing' | 'ready' | 'error'>('all')
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: '1',
      name: 'Biology_Chapter3.pdf',
      type: 'pdf',
      status: 'ready',
      uploadedAt: '2 days ago',
      size: '2.4 MB',
      embeddings: 156
    },
    {
      id: '2',
      name: 'Cell Biology Lecture - YouTube',
      type: 'youtube',
      status: 'ready',
      uploadedAt: '1 day ago',
      embeddings: 89
    },
    {
      id: '3',
      name: 'Genetics_Overview.pptx',
      type: 'ppt',
      status: 'processing',
      uploadedAt: 'Just now',
      size: '5.1 MB'
    },
    {
      id: '4',
      name: 'Khan Academy - DNA Structure',
      type: 'website',
      status: 'ready',
      uploadedAt: '3 days ago',
      embeddings: 234
    },
    {
      id: '5',
      name: 'Lab_Report_Template.docx',
      type: 'docx',
      status: 'error',
      uploadedAt: '1 hour ago',
      size: '1.2 MB'
    },
  ])

  const [isDragActive, setIsDragActive] = useState(false)
  const [urlInput, setUrlInput] = useState('')

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      const extension = file.name.split('.').pop()?.toLowerCase() as 'pdf' | 'docx' | 'ppt'
      
      const newMaterial: Material = {
        id: Date.now().toString(),
        name: file.name,
        type: extension || 'pdf',
        status: 'processing',
        uploadedAt: 'Just now',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      }
      setMaterials([newMaterial, ...materials])

      // Simulate RAG processing
      setTimeout(() => {
        setMaterials(prev => 
          prev.map(m => m.id === newMaterial.id ? { ...m, status: 'ready', embeddings: Math.floor(Math.random() * 300) + 50 } : m)
        )
      }, 3000)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const file = files[0]
      const extension = file.name.split('.').pop()?.toLowerCase() as 'pdf' | 'docx' | 'ppt'
      
      const newMaterial: Material = {
        id: Date.now().toString(),
        name: file.name,
        type: extension || 'pdf',
        status: 'processing',
        uploadedAt: 'Just now',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      }
      setMaterials([newMaterial, ...materials])

      // Simulate RAG processing
      setTimeout(() => {
        setMaterials(prev => 
          prev.map(m => m.id === newMaterial.id ? { ...m, status: 'ready', embeddings: Math.floor(Math.random() * 300) + 50 } : m)
        )
      }, 3000)
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      const urlType: 'youtube' | 'website' = urlInput.includes('youtube') ? 'youtube' : 'website'
      const urlName = urlInput.split('/').pop() || 'Website Link'
      
      const newMaterial: Material = {
        id: Date.now().toString(),
        name: urlName,
        type: urlType,
        status: 'processing',
        uploadedAt: 'Just now'
      }
      setMaterials([newMaterial, ...materials])
      setUrlInput('')

      // Simulate RAG processing
      setTimeout(() => {
        setMaterials(prev => 
          prev.map(m => m.id === newMaterial.id ? { ...m, status: 'ready', embeddings: Math.floor(Math.random() * 300) + 50 } : m)
        )
      }, 4000)
    }
  }

  const handleDeleteMaterial = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id))
  }

  const getTypeIcon = (type: Material['type']) => {
    switch (type) {
      case 'pdf':
      case 'docx':
      case 'ppt':
        return <FileText className="w-6 h-6" />
      case 'youtube':
        return <Video className="w-6 h-6" />
      case 'website':
        return <Globe className="w-6 h-6" />
      default:
        return <FileText className="w-6 h-6" />
    }
  }

  const getStatusIcon = (status: Material['status']) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'processing':
        return <Loader className="w-5 h-5 text-primary animate-spin" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-destructive" />
    }
  }

  const getStatusBadge = (status: Material['status']) => {
    const badges = {
      ready: 'bg-green-100 text-green-700',
      processing: 'bg-primary/10 text-primary',
      error: 'bg-destructive/10 text-destructive'
    }
    return badges[status]
  }

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || m.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <DashboardLayout title="Library" subtitle="Manage your uploaded materials and RAG embeddings">
      <div className="space-y-6">
        {/* Upload Zone */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Drag & Drop */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                  isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-foreground/2'
                }`}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-foreground/40" />
                <p className="text-lg font-semibold text-foreground mb-2">Drag and drop your files here</p>
                <p className="text-sm text-foreground/60 mb-4">PDF, DOCX, PPT, or Images</p>
                <label htmlFor="file-upload">
                  <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Browse Files
                  </Button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.pptx,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                />
              </div>

              {/* URL Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Paste YouTube or Website URL</label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://www.youtube.com/... or https://example.com/..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                    className="flex-1"
                  />
                  <Button onClick={handleUrlSubmit} className="bg-primary">
                    <Globe className="w-4 h-4 mr-2" />
                    Add URL
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <Input
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'ready', 'processing', 'error'].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                onClick={() => setFilterStatus(status as typeof filterStatus)}
                size="sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Materials List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-lg ${
                    material.type === 'pdf' ? 'bg-red-100 text-red-600' :
                    material.type === 'docx' ? 'bg-blue-100 text-blue-600' :
                    material.type === 'ppt' ? 'bg-orange-100 text-orange-600' :
                    material.type === 'youtube' ? 'bg-red-100 text-red-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {getTypeIcon(material.type)}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{material.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-foreground/60">
                      <span>{material.uploadedAt}</span>
                      {material.size && <span>• {material.size}</span>}
                      {material.embeddings && (
                        <span className="text-primary font-medium">• {material.embeddings} embeddings</span>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusBadge(material.status)}>
                      <span className="flex items-center gap-2">
                        {getStatusIcon(material.status)}
                        {material.status.charAt(0).toUpperCase() + material.status.slice(1)}
                      </span>
                    </Badge>

                    {/* Actions */}
                    {material.status === 'ready' && (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteMaterial(material.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                {/* RAG Processing Info */}
                {material.status === 'processing' && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-foreground/60 mb-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Processing RAG embeddings...</span>
                    </div>
                    <div className="w-full bg-foreground/10 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-foreground/20" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No materials found</h3>
            <p className="text-foreground/60">Upload files or add URLs to get started with RAG processing</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
