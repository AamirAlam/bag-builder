import { cn } from '../../lib/cn'

export function SectionHeader({ children, className }) {
  return (
    <p className={cn('text-[10px] text-dim tracking-[2px] uppercase mb-2.5', className)}>
      {children}
    </p>
  )
}
