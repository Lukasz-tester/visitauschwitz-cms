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
        default: 'h-10 px-5 py-4',
        icon: 'h-10 w-10',
      },
      variant: {
        default:
          'bg-slate-800/90 text-white/90 border border-white/80 hover:bg-amber-700/80 dark:hover:text-white/90',
        link: 'text-primary items-start justify-start underline-offset-4 hover:underline decoration-amber-700',

        outline:
          'bg-background/90 dark:bg-white/90 text-slate-800 dark:text-black/90 hover:text-white/90 border border-white/80 hover:bg-amber-700/70',
      },
    },
  },
)

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
