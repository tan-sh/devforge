'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Github } from 'lucide-react'
import { Button } from './Button'
import { GlowingBeam, SparkleEffect } from './animations'
import { cn } from '@/lib/utils'

interface NavLink {
  href: string
  label: string
}

const navLinks: NavLink[] = [
  { href: '/json', label: 'JSON Tools' },
  { href: '/base64', label: 'Base64' },
  { href: '/regex', label: 'RegEx' },
  { href: '/color', label: 'Colors' },
  { href: '/url', label: 'URL Parser' },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "backdrop-blur-xl bg-background/70" : "bg-transparent"
      )}
    >
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <nav className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="group relative flex items-center space-x-2"
          >
            <div className="relative">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/50 to-primary bg-[length:200%_100%] animate-text-shimmer">
                DevForge
              </span>
              <div className="absolute -inset-x-2 -inset-y-1 bg-primary/10 blur-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative px-4 py-2 text-sm transition-colors duration-500",
                  "hover:text-white focus-visible:text-white",
                  pathname === link.href ? "text-white" : "text-foreground/80",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md"
                )}
              >
                {/* Hover effect container */}
                <div className="absolute inset-0 rounded-md overflow-hidden">
                  {/* Top light beam */}
                  <div className="absolute top-0 h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  {/* Bottom light beam */}
                  <div className="absolute bottom-0 h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-1000" />
                  {/* Left border highlight */}
                  <div className="absolute left-0 w-px h-full bg-gradient-to-b from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-700" />
                  {/* Right border highlight */}
                  <div className="absolute right-0 w-px h-full bg-gradient-to-b from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-700" />
                  {/* Neon glow effect */}
                  <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-700 bg-primary/5 shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] pointer-events-none" />
                </div>
                {link.label}
                {pathname === link.href && (
                  <div className="absolute -bottom-px left-0 right-0 h-px bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.7)]" />
                )}
              </Link>
            ))}
            <a
              href="https://github.com/yourusername/devforge"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative ml-4 px-4 py-2 text-sm text-foreground/80 hover:text-primary transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 flex items-center gap-2"
            >
              <Github className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="relative">
                GitHub
                <div className="absolute inset-x-0 -bottom-px h-px scale-x-0 group-hover:scale-x-100 transition-transform bg-primary/50 origin-left" />
              </span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary group"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <SparkleEffect className="opacity-0 group-hover:opacity-100" />
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-foreground/80 group-hover:text-primary transition-colors" />
            ) : (
              <Menu className="w-5 h-5 text-foreground/80 group-hover:text-primary transition-colors" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden absolute inset-x-0 top-full bg-background/80 backdrop-blur-lg border-b border-primary/10",
            "transition-all duration-300 ease-in-out",
            isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          )}
        >
          <div className="container py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-4 py-2 text-sm rounded-md transition-colors duration-500",
                  "hover:bg-primary/10 hover:text-white focus-visible:text-white",
                  pathname === link.href ? "text-white bg-primary/5 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]" : "text-foreground/80"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/yourusername/devforge"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Bottom accent line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      {/* Side accent lines */}
      <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
    </header>
  )
} 