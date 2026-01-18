'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, Users, BarChart3, Zap, BookOpen, Target } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-3xl font-bold text-foreground">
            QuizLab
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-foreground/70 hover:text-foreground font-medium">Features</Link>
            <Link href="#how-it-works" className="text-foreground/70 hover:text-foreground font-medium">How it Works</Link>
            <Link href="/pricing" className="text-foreground/70 hover:text-foreground font-medium">Pricing</Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-foreground hover:text-primary font-semibold">
                LOG IN
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 rounded-full font-semibold">
                GET STARTED
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-24 flex flex-col lg:flex-row items-center gap-12">
        {/* Left Content */}
        <div className="flex-1">
          <div className="mb-6 inline-block">
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
              🚀 AI-Powered Quiz Generation
            </span>
          </div>
          <h1 className="text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
            Create Smart Quizzes, Manage Classes with AI
          </h1>
          <p className="text-xl text-foreground/70 mb-8 max-w-xl leading-relaxed">
            Upload your teaching materials, and let AI generate engaging quizzes instantly. Manage classes, track student progress, and host live interactive sessions—all in one platform.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/login">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full font-semibold text-base">
                Start Free Trial
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" className="px-8 py-3 rounded-full font-semibold text-base border-border text-foreground hover:bg-card bg-transparent">
                See Features
              </Button>
            </Link>
          </div>
          <p className="text-sm text-foreground/60 mt-8">✓ No credit card required • ✓ Free for teachers • ✓ 5-minute setup</p>
        </div>

        {/* Right Content - Dashboard Preview */}
        <div className="flex-1">
          <div className="relative w-full">
            {/* Dashboard Mock */}
            <div className="bg-card rounded-2xl shadow-2xl overflow-hidden border border-border">
              {/* Browser Tab */}
              <div className="bg-muted px-6 py-4 flex items-center gap-3 border-b border-border">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs text-foreground/60 font-mono ml-4">quizlab.app/dashboard</span>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 bg-background/50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-foreground">Teacher Dashboard</h3>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Live</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-card border border-border rounded-lg p-3">
                      <p className="text-xs text-foreground/60">Classes</p>
                      <p className="text-2xl font-bold text-foreground">12</p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-3">
                      <p className="text-xs text-foreground/60">Quizzes</p>
                      <p className="text-2xl font-bold text-primary">48</p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-3">
                      <p className="text-xs text-foreground/60">Students</p>
                      <p className="text-2xl font-bold text-foreground">247</p>
                    </div>
                  </div>
                  <div className="mt-4 h-24 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-end justify-center gap-1 px-4 pb-4">
                    {[12, 18, 15, 22, 25, 20, 28].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-primary rounded-t"
                        style={{ height: `${(h / 30) * 100}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-8 py-20 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features for Modern Teaching</h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">Everything you need to create engaging quizzes and manage your classroom effectively</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Sparkles,
              title: 'AI Quiz Generation',
              description: 'Upload PDFs, docs, or URLs. Our AI instantly creates engaging quizzes from your teaching materials.'
            },
            {
              icon: BookOpen,
              title: 'RAG Technology',
              description: 'Retrieval-Augmented Generation ensures questions are accurate and contextually relevant to your content.'
            },
            {
              icon: Users,
              title: 'Class Management',
              description: 'Create classes, invite students with unique join codes, and manage everything from one dashboard.'
            },
            {
              icon: Zap,
              title: 'Live Sessions',
              description: 'Host Kahoot-style live quizzes with colorful buttons, instant feedback, and real-time leaderboards.'
            },
            {
              icon: BarChart3,
              title: 'Analytics & Reports',
              description: 'Track student performance with detailed analytics, score distributions, and learning trends.'
            },
            {
              icon: Target,
              title: 'Customizable Quizzes',
              description: 'Choose question types, difficulty levels, and quantity. Edit and refine before publishing.'
            }
          ].map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card key={idx} className="border border-border hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">{feature.title}</h3>
                  <p className="text-foreground/60 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-8 py-20 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-lg text-foreground/60">Get started in 4 simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: 1, title: 'Upload Materials', desc: 'Add PDFs, documents, videos, or website links' },
            { step: 2, title: 'Choose Topics', desc: 'Select specific materials for quiz generation' },
            { step: 3, title: 'Configure Quiz', desc: 'Set question types, difficulty, and quantity' },
            { step: 4, title: 'Publish & Share', desc: 'Share with your class or host live sessions' }
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-foreground/60">{item.desc}</p>
              {idx < 3 && <div className="hidden md:block absolute left-full top-6 w-8 h-0.5 bg-border"></div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-8 py-20 border-t border-border">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-12 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Ready to Transform Your Teaching?</h2>
          <p className="text-lg text-foreground/60 mb-8 max-w-2xl mx-auto">Join thousands of educators using QuizLab to create smarter quizzes and engage students like never before.</p>
          <Link href="/signup">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full font-semibold text-base">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-foreground mb-4">QuizLab</h3>
              <p className="text-sm text-foreground/60">AI-powered quiz generation and classroom management</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><Link href="#" className="hover:text-foreground">Documentation</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><Link href="#" className="hover:text-foreground">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-foreground/60">
            <p>&copy; 2026 QuizLab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
