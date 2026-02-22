import { Stat } from '../ui/Stat'
import { Card } from '../ui/Card'
import { SectionHeader } from '../ui/SectionHeader'
import { ProgressBar } from '../ui/ProgressBar'

const fmt = (n) => `$${Math.round(n).toLocaleString('en-US')}`
const pf = (n) => `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`

const NARR = ['AI Agents', 'Memecoins', 'DePIN', 'RWA', 'Gaming', 'L1/L2', 'DeFi', 'Privacy', 'Other']

export function StatsView({ trades, onEdit, onDelete }) {
  const closed = trades.filter(t => t.status === 'closed' && t.pnlUsd !== null)

  const narrStats = NARR.map(n => {
    const ts = closed.filter(t => t.narrative === n)
    if (!ts.length) return null
    return {
      name: n,
      trades: ts.length,
      pnl: ts.reduce((a, t) => a + t.pnlUsd, 0),
      wr: (ts.filter(t => t.pnlUsd > 0).length / ts.length) * 100,
      avg: ts.reduce((a, t) => a + t.pnlPct, 0) / ts.length,
    }
  }).filter(Boolean).sort((a, b) => b.pnl - a.pnl)

  if (narrStats.length === 0 && trades.length === 0) {
    return (
      <Card className="text-center py-10">
        <p className="text-dim">Log trades to see stats</p>
      </Card>
    )
  }

  return (
    <div>
      {narrStats.length === 0 ? (
        <Card className="text-center py-10">
          <p className="text-dim">Close trades to see stats</p>
        </Card>
      ) : (
        <>
          <Card>
            <SectionHeader>Narrative Breakdown</SectionHeader>
            {narrStats.map((n, i) => (
              <div key={i} className="py-2.5" style={{ borderBottom: '1px solid #1a1a1a' }}>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-[13px]">{n.name}</span>
                  <span className="font-bold" style={{ color: n.pnl >= 0 ? '#00cc66' : '#ff4444' }}>{fmt(n.pnl)}</span>
                </div>
                <div className="flex gap-3 text-[10px] text-sub mb-1.5">
                  <span>{n.trades} trades</span>
                  <span style={{ color: n.wr >= 50 ? '#00cc66' : '#ff4444' }}>{n.wr.toFixed(0)}% WR</span>
                  <span style={{ color: n.avg >= 0 ? '#00cc66' : '#ff4444' }}>Avg {pf(n.avg)}</span>
                </div>
                <ProgressBar value={Math.min(n.wr, 100)} color={n.pnl >= 0 ? '#00cc66' : '#ff4444'} />
              </div>
            ))}
          </Card>

          <Card>
            <SectionHeader>Distribution</SectionHeader>
            {NARR.map(n => {
              const c = closed.filter(t => t.narrative === n).length
              if (!c) return null
              const w = (c / closed.length) * 100
              return (
                <div key={n} className="mb-1.5">
                  <div className="flex justify-between mb-0.5">
                    <span className="text-[11px] text-sub">{n}</span>
                    <span className="text-[11px] text-dim">{c} ({w.toFixed(0)}%)</span>
                  </div>
                  <ProgressBar value={w} color="#fff" />
                </div>
              )
            })}
          </Card>
        </>
      )}

      {closed.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5 mb-2.5">
          <Stat label="Closed" value={closed.length} />
          <Stat label="Wins" value={closed.filter(t => t.pnlUsd > 0).length} color="#00cc66" />
          <Stat label="Losses" value={closed.filter(t => t.pnlUsd <= 0).length} color="#ff4444" />
        </div>
      )}

      {trades.length > 0 && [...trades].map(t => (
        <div key={t.id} className="rounded-xl p-3 mb-1.5 border border-border bg-surface"
          style={{ borderLeft: `3px solid ${t.status === 'open' ? '#ccaa00' : t.pnlUsd >= 0 ? '#00cc66' : '#ff4444'}` }}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-bold text-[13px]">${t.coin}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-alt text-sub">{t.type.toUpperCase()}{t.leverage > 1 ? ` ${t.leverage}X` : ''}</span>
              {t.narrative && <span className="text-[9px] px-1.5 py-0.5 rounded bg-alt text-dim">{t.narrative}</span>}
              {t.tp1 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-alt text-green">TP✓</span>}
            </div>
            {t.pnlUsd !== null
              ? <span className="font-bold text-[12px]" style={{ color: t.pnlUsd >= 0 ? '#00cc66' : '#ff4444' }}>{pf(t.pnlPct)} ({fmt(t.pnlUsd)})</span>
              : <span className="text-yellow text-[11px]">Open</span>
            }
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-dim">
            <span>{t.date} · {fmt(t.size)}</span>
            <div className="flex gap-2">
              <button onClick={() => onEdit(t)} className="bg-transparent border-none text-sub cursor-pointer text-[10px] hover:text-tx transition-colors">Edit</button>
              <button onClick={() => onDelete(t.id)} className="bg-transparent border-none text-red cursor-pointer text-[10px] hover:opacity-70 transition-opacity">Del</button>
            </div>
          </div>
          {t.notes && <p className="text-[10px] text-dim mt-0.5 italic">{t.notes}</p>}
        </div>
      ))}
    </div>
  )
}
