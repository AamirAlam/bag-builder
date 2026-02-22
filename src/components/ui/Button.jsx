import { cn } from '../../lib/cn'

const variants = {
  primary: 'bg-tx text-bg border-transparent hover:opacity-90',
  ghost: 'bg-transparent text-sub border-border hover:border-sub',
  danger: 'bg-transparent text-red border-red hover:opacity-80',
}

const sizes = {
  md: 'py-[14px] px-4 text-[14px]',
  sm: 'py-[10px] px-3 text-[12px]',
}

export function Button({ variant = 'primary', size = 'md', fullWidth = true, disabled, onClick, children, className }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-[10px] border font-bold cursor-pointer tracking-[0.5px] transition-all duration-150',
        fullWidth && 'w-full',
        variants[variant],
        sizes[size],
        disabled && 'opacity-30 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  )
}
