import { forwardRef } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'default' | 'outline' | 'ghost' | 'icon'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variant === 'default' && "bg-primary text-white hover:bg-primary/90",
        variant === 'outline' && "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        variant === 'ghost' && "hover:bg-accent hover:text-accent-foreground",
        variant === 'icon' && "h-10 w-10 p-0",
        size === 'default' && "h-10 px-4 py-2",
        size === 'sm' && "h-9 rounded-md px-3",
        size === 'lg' && "h-11 rounded-md px-8",
        size === 'icon' && "h-10 w-10",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }