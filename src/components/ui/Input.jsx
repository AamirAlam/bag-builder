import { cn } from '../../lib/cn'

const baseClass = 'w-full px-3 py-[10px] rounded-lg border border-border bg-bg text-tx text-[13px] outline-none focus:border-sub box-border transition-colors duration-150'

export function Input({ type = 'text', value, onChange, onKeyDown, placeholder, autoFocus, className, style }) {
  if (type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(baseClass, 'min-h-[100px] resize-y leading-relaxed', className)}
        style={style}
      />
    )
  }
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className={cn(baseClass, className)}
      style={style}
    />
  )
}
