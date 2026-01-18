'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

export default function Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <nav className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight text-foreground">
          MUX
        </Link>

        {/* Center Menu */}
        <div className="hidden md:flex items-center gap-8">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-foreground/80 transition font-medium">
              Product <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Video API</DropdownMenuItem>
              <DropdownMenuItem>Image API</DropdownMenuItem>
              <DropdownMenuItem>Data Queries</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-foreground/80 transition font-medium">
              Solutions <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>For Developers</DropdownMenuItem>
              <DropdownMenuItem>For Enterprises</DropdownMenuItem>
              <DropdownMenuItem>For Platforms</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-foreground/80 transition font-medium">
              Developers <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Documentation</DropdownMenuItem>
              <DropdownMenuItem>API Reference</DropdownMenuItem>
              <DropdownMenuItem>Guides</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="#pricing" className="text-foreground hover:text-foreground/80 transition font-medium">
            Pricing
          </Link>

          <Link href="#blog" className="text-foreground hover:text-foreground/80 transition font-medium">
            Blog
          </Link>
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-foreground font-medium">
              LOG IN
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 font-medium">
              TALK TO US
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}
