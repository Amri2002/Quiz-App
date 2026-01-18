'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Brain, Zap } from 'lucide-react'

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="w-4 h-4" />
            AI-Powered Quiz Generation
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            Transform Your Teaching with AI-Generated Quizzes
          </h1>
          
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Upload your materials, generate engaging quizzes instantly, and track student performance—all powered by advanced AI and RAG technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center">
            <Link href="/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-lg font-semibold">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="rounded-full px-8 py-6 text-lg font-semibold">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-4 justify-center pt-8">
            <div className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">RAG Technology</span>
            </div>
            <div className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Instant Generation</span>
            </div>
            <div className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Live Quiz Sessions</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
