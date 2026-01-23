import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const buttonVariants = ({ variant = 'default', size = 'default' }: { variant?: ButtonProps['variant'], size?: ButtonProps['size'] } = {}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    default: "bg-primary text-white hover:bg-primary/90 active:scale-[0.98]",
    destructive: "bg-destructive text-white hover:bg-destructive/90 active:scale-[0.98]",
    outline: "border border-border bg-transparent hover:bg-secondary hover:border-border/80",
    secondary: "bg-secondary text-foreground hover:bg-secondary/80",
    ghost: "hover:bg-secondary/50 hover:text-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  }
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-11 rounded-lg px-6",
    icon: "h-10 w-10",
  }

  return cn(baseStyles, variants[variant], sizes[size])
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
