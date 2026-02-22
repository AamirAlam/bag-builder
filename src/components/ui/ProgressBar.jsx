export function ProgressBar({ value, color = '#fff', className }) {
  const pct = Math.min(Math.max(value, 0), 100)
  return (
    <div className="h-[3px] bg-muted rounded-[2px] w-full overflow-hidden">
      <div
        className="h-[3px] rounded-[2px] transition-all duration-300"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}
