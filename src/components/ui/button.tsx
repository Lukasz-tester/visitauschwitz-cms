import { cn } from 'src/utilities/cn'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        clear: '',
        default: 'h-10 px-4 py-2',
        icon: 'h-10 w-10',
        lg: 'h-11 rounded px-8',
        sm: 'h-9 rounded px-3',
      },
      variant: {
        default:
          'bg-slate-800/50 text-white/90 border border-white/80 hover:bg-amber-700/80 dark:hover:text-white/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        ghost: 'hover:bg-card hover:text-accent-foreground',
        link: 'text-primary items-start justify-start underline-offset-4 hover:underline decoration-amber-700',
        outline:
          'bg-background/80 dark:bg-white/80 text-slate-800 dark:text-black/90 hover:text-white/90 border border-white/80 hover:bg-amber-700/80',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      },
    },
  },
)

// prose-a:bg-card-foreground prose-a:text-nowrap prose-a:p-2 prose-a:mx-0.5 prose-a:font-normal prose-a:no-underline prose-a:rounded-xl prose-a:text-xl prose-a:leading-[2.6] gap-9 prose-a:border prose-a:border-slate-500/40 dark:hover:prose-a:border-white/85 hover:prose-a:text-primary-foreground/90 dark:hover:prose-a:text-white/90

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, size, variant, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ className, size, variant }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
