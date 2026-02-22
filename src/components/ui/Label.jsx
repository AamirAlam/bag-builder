import { cn } from '../../lib/cn'

export function Label({ children, className }) {
  return (
    <span className={cn('text-[10px] text-dim tracking-[0.5px] mb-[3px] block uppercase', className)}>
      {children}
    </span>
  )
}
