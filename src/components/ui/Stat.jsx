import { cn } from '../../lib/cn'

export function Stat({ label, value, color, sub }) {
  const colorClass = color ? `text-[${color}]` : 'text-tx'

  return (
    <div className="bg-surface rounded-xl p-4 border border-border text-center">
      <p className="text-[9px] text-dim tracking-[1.5px] uppercase mb-1">{label}</p>
      <p className={cn('text-[18px] font-bold', colorClass)} style={color ? { color } : undefined}>
        {value}
      </p>
      {sub && <p className="text-[9px] text-dim mt-0.5">{sub}</p>}
    </div>
  )
}
