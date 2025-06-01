'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { GlowingBeam, PulseBeam, SparkleEffect } from './animations'

const buttonVariants = cva(
  'relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        default: [
          // Base styles
          'bg-background border border-primary/50 text-foreground',
          // Hover and focus states
          'hover:border-primary hover:bg-primary/10',
          // Active state
          'active:scale-[0.98] active:bg-primary/20',
          // Custom classes for cyber effect
          'before:absolute before:inset-0 before:rounded-[inherit] before:bg-primary/0 before:transition-all',
          'hover:before:bg-primary/5',
        ],
        ghost: [
          // Base styles
          'text-foreground/80 bg-transparent',
          // Hover and focus states
          'hover:bg-primary/10 hover:text-primary',
          // Active state
          'active:bg-primary/20',
        ],
        link: [
          // Base styles
          'text-primary underline-offset-4',
          // Hover and focus states
          'hover:text-primary/80 hover:underline',
        ],
        outline: [
          // Base styles
          'border-glow bg-background',
          // Hover and focus states
          'hover:bg-primary/5',
          // Active state
          'active:bg-primary/10',
        ],
        neon: [
          // Base styles
          'bg-primary text-primary-foreground shadow-neon overflow-hidden',
          // Hover and focus states
          'hover:shadow-neon-strong hover:scale-[1.02]',
          // Active state
          'active:scale-[0.98]',
        ],
        matrix: [
          // Base styles
          'bg-background border border-primary/30 text-primary overflow-hidden',
          // Custom matrix effect classes
          'before:absolute before:inset-0 before:bg-[linear-gradient(transparent,theme(colors.primary.DEFAULT))] before:animate-matrix-fade before:opacity-0',
          'hover:before:opacity-10',
        ],
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-11 px-8 text-base',
        icon: 'h-10 w-10',
      },
      hasGlow: {
        true: 'group',
        false: '',
      },
      hasSparkles: {
        true: 'group',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      hasGlow: false,
      hasSparkles: false,
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, hasGlow, hasSparkles, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, hasGlow, hasSparkles, className }))}
        ref={ref}
        {...props}
      >
        {hasGlow && <GlowingBeam className="opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}
        {variant === 'neon' && <PulseBeam className="opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}
        {hasSparkles && <SparkleEffect className="opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}
        {props.children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants } 