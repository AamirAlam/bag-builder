import { cn } from '../../lib/cn'

const accentColors = {
  green: 'border-l-green',
  red: 'border-l-red',
  yellow: 'border-l-yellow',
  border: 'border-l-border',
}

export function Card({ accent, children, className, style }) {
  return (
    <div
      style={style}
      className={cn(
        'bg-surface rounded-xl p-4 mb-2.5 border border-border',
        accent && `border-l-[3px] ${accentColors[accent] || ''}`,
        className
      )}
    >
      {children}
    </div>
  )
}
