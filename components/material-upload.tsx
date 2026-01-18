'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Upload, FileText, Video, Globe, CheckCircle, AlertCircle, Loader } from 'lucide-react'

interface UploadedMaterial {
  id: string
  name: string
  type: 'file' | 'url'
  status: 'processing' | 'ready' | 'error'
  uploadedAt: string
}

export default function MaterialUpload() {
  const [materials, setMaterials] = useState<UploadedMaterial[]>([
    {
      id: '1',
      name: 'Biology_Chapter3.pdf',
      type: 'file',
      status: 'ready',
      uploadedAt: '2 days ago'
    },
    {
      id: '2',
      name: 'Cell Biology Lecture',
      type: 'url',
      status: 'processing',
      uploadedAt: 'Just now'
    },
  ])

  const [urlInput, setUrlInput] = useState('')
  const [isDragActive, setIsDragActive] = useState(false)

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
      const newMaterial: UploadedMaterial = {
        id: Date.now().toString(),
        name: files[0].name,
        type: 'file',
        status: 'processing',
        uploadedAt: 'Just now'
      }
      setMaterials([...materials, newMaterial])

      // Simulate processing
      setTimeout(() => {
        setMaterials(prev => 
          prev.map(m => m.id === newMaterial.id ? { ...m, status: 'ready' } : m)
        )
      }, 2000)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const newMaterial: UploadedMaterial = {
        id: Date.now().toString(),
        name: files[0].name,
        type: 'file',
        status: 'processing',
        uploadedAt: 'Just now'
      }
      setMaterials([...materials, newMaterial])

      // Simulate processing
      setTimeout(() => {
        setMaterials(prev => 
          prev.map(m => m.id === newMaterial.id ? { ...m, status: 'ready' } : m)
        )
      }, 2000)
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      const urlType = urlInput.includes('youtube') ? 'YouTube' : 'Website'
      const newMaterial: UploadedMaterial = {
        id: Date.now().toString(),
        name: `${urlType} - ${urlInput.split('/').pop()}`,
        type: 'url',
        status: 'processing',
        uploadedAt: 'Just now'
      }
      setMaterials([...materials, newMaterial])
      setUrlInput('')

      // Simulate processing
      setTimeout(() => {
        setMaterials(prev => 
          prev.map(m => m.id === newMaterial.id ? { ...m, status: 'ready' } : m)
        )
      }, 3000)
    }
  }

  const getStatusIcon = (status: UploadedMaterial['status']) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'processing':
        return <Loader className="w-5 h-5 text-primary animate-spin" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-destructive" />
    }
  }

  const getStatusBadge = (status: UploadedMaterial['status']) => {
    const badges = {
      ready: 'bg-green-100 text-green-700',
      processing: 'bg-primary/10 text-primary',
      error: 'bg-destructive/10 text-destructive'
    }
    return badges[status]
  }

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Materials</CardTitle>
          <CardDescription>Upload PDF, DOCX, PPT files or paste YouTube/Website links</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Drag & Drop Area */}
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
            <p className="text-sm text-foreground/60 mb-4">or</p>
            <label htmlFor="file-upload-input">
              <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload-input')?.click()}>
                Browse Files
              </Button>
            </label>
            <input
              id="file-upload-input"
              type="file"
              className="hidden"
              accept=".pdf,.docx,.pptx,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
            />
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Paste URL</label>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://www.youtube.com/... or https://example.com/..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
              />
              <Button
                onClick={handleUrlSubmit}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Add URL
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Materials</CardTitle>
          <CardDescription>{materials.length} material(s) in your library</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {materials.map((material) => (
              <div
                key={material.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-foreground/2 transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  {material.type === 'file' ? (
                    <FileText className="w-5 h-5 text-foreground/60" />
                  ) : (
                    <Video className="w-5 h-5 text-foreground/60" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{material.name}</p>
                    <p className="text-xs text-foreground/60">{material.uploadedAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(material.status)}`}>
                    {material.status === 'ready' ? 'Ready' : material.status === 'processing' ? 'Processing' : 'Error'}
                  </span>
                  {getStatusIcon(material.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
