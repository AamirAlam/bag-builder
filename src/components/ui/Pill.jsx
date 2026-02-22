import { cn } from '../../lib/cn'

const colorMap = {
  green: { active: 'border-green bg-green text-bg', inactive: 'border-border bg-transparent text-sub' },
  red: { active: 'border-red bg-red text-bg', inactive: 'border-border bg-transparent text-sub' },
  yellow: { active: 'border-yellow bg-yellow text-bg', inactive: 'border-border bg-transparent text-sub' },
}

export function Pill({ active, onClick, children, color, className }) {
  const colorStyle = color && colorMap[color]
  const activeClass = colorStyle ? colorStyle.active : 'border-tx bg-tx text-bg font-bold'
  const inactiveClass = colorStyle ? colorStyle.inactive : 'border-border bg-transparent text-sub'

  return (
    <button
      onClick={onClick}
      className={cn(
        'py-[7px] px-[14px] rounded-lg border text-[11px] cursor-pointer transition-all duration-150',
        active ? activeClass : inactiveClass,
        active && !color && 'font-bold',
        className
      )}
    >
      {children}
    </button>
  )
}
