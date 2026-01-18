'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: [
        'Up to 3 classes',
        '10 quizzes per month',
        'Basic quiz generation',
        'Student response viewing',
        'Community support'
      ],
      cta: 'Get Started',
      highlighted: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'For active teachers',
      features: [
        'Unlimited classes',
        'Unlimited quizzes',
        'Advanced AI generation',
        'Live session hosting (100 students)',
        'Analytics & reports',
        'Question bank library',
        'Email support',
        'Custom branding'
      ],
      cta: 'Start Free Trial',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For schools & districts',
      features: [
        'Everything in Pro',
        'Unlimited live sessions',
        'SSO & advanced security',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'Priority support',
        'Staff training included'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-3xl font-bold text-foreground">
            QuizLab
          </Link>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-foreground hover:text-primary font-semibold">
                LOG IN
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 rounded-full font-semibold">
                SIGN UP
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
            Choose the perfect plan for your teaching needs. All plans include our core AI quiz generation features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, idx) => (
            <Card
              key={idx}
              className={`relative transition-all ${
                plan.highlighted
                  ? 'md:scale-105 border-primary shadow-2xl'
                  : 'border-border'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.period && <span className="text-foreground/60">{plan.period}</span>}
                </div>

                <Link href="/signup">
                  <Button
                    className={`w-full py-6 text-base font-semibold ${
                      plan.highlighted
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'border-2 border-border text-foreground hover:bg-card'
                    }`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>

                <div className="space-y-3">
                  {plan.features.map((feature, featureIdx) => (
                    <div key={featureIdx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/70">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-card border border-border rounded-lg p-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Can I change plans anytime?</h3>
              <p className="text-foreground/60">Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">What payment methods do you accept?</h3>
              <p className="text-foreground/60">We accept all major credit cards, PayPal, and bank transfers for Enterprise customers.</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Is there a free trial?</h3>
              <p className="text-foreground/60">Yes! Pro and Enterprise plans come with a 14-day free trial. No credit card required.</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">What about student accounts?</h3>
              <p className="text-foreground/60">Student accounts are always free! Only teachers need a paid plan to access advanced features.</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Do you offer discounts for schools?</h3>
              <p className="text-foreground/60">Yes! Contact our sales team at sales@quizlab.app for volume pricing and school district packages.</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">What if I have more questions?</h3>
              <p className="text-foreground/60">Our support team is always happy to help. Email support@quizlab.app or use the live chat on our website.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-foreground/60 mb-6">Ready to transform your teaching?</p>
          <Link href="/signup">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full font-semibold text-base">
              Start Your Free Trial Today
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
