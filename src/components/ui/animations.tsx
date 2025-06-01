'use client'

import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function GlowingBeam({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none",
        className
      )} 
      {...props}
    >
      <div className="absolute inset-x-0 h-px top-0 bg-gradient-to-r from-transparent via-primary/80 to-transparent animate-glow-line-horizontal" />
      <div className="absolute inset-x-0 h-px bottom-0 bg-gradient-to-r from-transparent via-primary/80 to-transparent animate-glow-line-horizontal [animation-delay:150ms]" />
      <div className="absolute inset-y-0 w-px left-0 bg-gradient-to-b from-transparent via-primary/80 to-transparent animate-glow-line-vertical" />
      <div className="absolute inset-y-0 w-px right-0 bg-gradient-to-b from-transparent via-primary/80 to-transparent animate-glow-line-vertical [animation-delay:150ms]" />
    </div>
  )
}

export function PulseBeam({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none",
        className
      )} 
      {...props}
    >
      <div className="absolute inset-0 bg-primary/30 blur-[6px] scale-[0.8] animate-pulse" />
      <div className="absolute inset-0 bg-primary/20 blur-[1px] scale-[0.9] animate-pulse [animation-delay:150ms]" />
    </div>
  )
}

export function SparkleEffect({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none mix-blend-soft-light",
        className
      )} 
      {...props}
    >
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary rounded-full animate-sparkle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 750}ms`
          }}
        />
      ))}
    </div>
  )
}

export function CircuitPattern({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none opacity-40",
        className
      )} 
      {...props}
    >
      <svg width="100%" height="100%" className="absolute inset-0">
        <pattern
          id="circuit-pattern"
          x="0"
          y="0"
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
          className="text-primary/20"
        >
          <path
            d="M0 16h4v1H0v-1zm8 0h4v1H8v-1zm8 0h4v1h-4v-1zm8 0h4v1h-4v-1z"
            fill="currentColor"
          />
          <path
            d="M0 16V8h1v8H0zm0 8v-8h1v8H0zm8-16V0h1v8H8zm0 16v-8h1v8H8zm8-16V0h1v8h-1zm0 16v-8h1v8h-1zm8-16V0h1v8h-1zm0 16v-8h1v8h-1z"
            fill="currentColor"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
      </svg>
    </div>
  )
} 