import { cn } from '@/lib/utils'

interface TechBadgeProps {
  tech: string
  className?: string
}

export function TechBadge({ tech, className }: TechBadgeProps) {
  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border",
        className
      )}
    >
      {tech}
    </span>
  )
}
