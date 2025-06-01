import { HTMLAttributes, forwardRef } from 'react'
import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { GlowingBeam, CircuitPattern } from './animations'

const cardVariants = cva(
  'relative rounded-lg transition-all duration-500 group',
  {
    variants: {
      variant: {
        default: [
          // Base styles
          'bg-background/50 backdrop-blur-lg border border-border/50',
          // Hover effects
          'hover:border-primary/50 hover:shadow-glow-sm',
          // Group hover effects for inner elements
          'group-hover:bg-background/60',
        ],
        glass: [
          // Base styles
          'bg-white/5 backdrop-blur-xl border border-white/10',
          // Shadow and hover effects
          'shadow-[0_8px_32px_rgba(0,0,0,0.37)]',
          'hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]',
          'hover:border-primary/30',
          // Gradient overlay
          'before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/5 before:to-white/0 before:opacity-0 before:transition-opacity before:duration-500',
          'hover:before:opacity-100',
        ],
        outline: [
          // Base styles
          'border-glow bg-background/80',
          // Hover effects
          'hover:bg-background',
          'hover:shadow-glow-md',
        ],
        neon: [
          // Base styles
          'bg-primary/5 border border-primary/50',
          // Shadow and hover effects
          'shadow-neon',
          'hover:shadow-neon-strong',
          'hover:scale-[1.02]',
          // Transition
          'transition-all duration-300',
        ],
      },
      size: {
        default: 'p-6',
        sm: 'p-4',
        lg: 'p-8',
      },
      hasPattern: {
        true: 'overflow-hidden',
        false: '',
      },
      hasGlow: {
        true: 'overflow-hidden',
        false: '',
      },
      interactive: {
        true: 'cursor-pointer transform-gpu hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      hasPattern: false,
      hasGlow: false,
      interactive: false,
    },
  }
)

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, hasPattern, hasGlow, interactive, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, size, hasPattern, hasGlow, interactive, className }))}
        {...props}
      >
        {hasPattern && <CircuitPattern />}
        {hasGlow && <GlowingBeam className="opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}
        {props.children}
      </div>
    )
  }
)
Card.displayName = 'Card'

export { Card, cardVariants } 