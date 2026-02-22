import { Stat } from '../ui/Stat'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { SectionHeader } from '../ui/SectionHeader'
import { ProgressBar } from '../ui/ProgressBar'

const fmt = (n) => `$${Math.round(n).toLocaleString('en-US')}`
const pf = (n) => `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`

export function HomeView({ trades, stables, contribs, settings, emergency, setEmergency, setView }) {
  const closed = trades.filter(t => t.status === 'closed' && t.pnlUsd !== null)
  const open = trades.filter(t => t.status === 'open')
  const totalPnl = closed.reduce((a, t) => a + t.pnlUsd, 0)
  const totalStables = stables.reduce((a, s) => a + s.amount, 0)
  const openVal = open.reduce((a, t) => a + t.size, 0)
  const totalPort = totalStables + totalPnl + openVal
  const winRate = closed.length ? (closed.filter(t => t.pnlUsd > 0).length / closed.length) * 100 : 0
  const deployed = closed.reduce((a, t) => a + t.size, 0)
  const roi = deployed > 0 ? (totalPnl / deployed) * 100 : 0
  const avgPct = closed.length ? closed.reduce((a, t) => a + t.pnlPct, 0) / closed.length : 0
  const best = closed.length ? closed.reduce((a, t) => t.pnlUsd > a.pnlUsd ? t : a, closed[0]) : null
  const worst = closed.length ? closed.reduce((a, t) => t.pnlUsd < a.pnlUsd ? t : a, closed[0]) : null
  const totalContrib = contribs.reduce((a, c) => a + c.amount, 0)
  const tpRate = closed.length ? ((closed.filter(t => t.tp1).length / closed.length) * 100).toFixed(0) : 0

  const streak = () => {
    let c = 0, tp = null
    for (let i = closed.length - 1; i >= 0; i--) {
      const w = closed[i].pnlUsd > 0
      if (tp === null) tp = w
      if (w === tp) c++
      else break
    }
    return tp === null ? '—' : `${c}${tp ? 'W' : 'L'}`
  }

  const NARR = ['AI Agents', 'Memecoins', 'DePIN', 'RWA', 'Gaming', 'L1/L2', 'DeFi', 'Privacy', 'Other']
  const narrStats = NARR.map(n => {
    const ts = closed.filter(t => t.narrative === n)
    if (!ts.length) return null
    return { name: n, trades: ts.length, pnl: ts.reduce((a, t) => a + t.pnlUsd, 0), wr: (ts.filter(t => t.pnlUsd > 0).length / ts.length) * 100 }
  }).filter(Boolean).sort((a, b) => b.pnl - a.pnl)

  const startingCapital = settings?.profile_data?.capital || 0

  return (
    <div>
      <div className="grid grid-cols-4 gap-1.5 mb-2.5">
        <Stat label="Win Rate" value={`${winRate.toFixed(0)}%`} color={winRate >= 50 ? '#00cc66' : closed.length ? '#ff4444' : '#555'} />
        <Stat label="Trades" value={closed.length} />
        <Stat label="Streak" value={streak()} />
        <Stat label="ROI" value={pf(roi)} color={roi >= 0 ? '#00cc66' : '#ff4444'} />
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-2.5">
        <Stat label="Avg Return" value={pf(avgPct)} color={avgPct >= 0 ? '#00cc66' : '#ff4444'} />
        <Stat label="TP Discipline" value={`${tpRate}%`} color={tpRate >= 70 ? '#00cc66' : closed.length ? '#ccaa00' : '#555'} />
      </div>

      <Card>
        <SectionHeader>Performance</SectionHeader>
        {[
          { l: 'Best', v: best ? `$${best.coin} ${fmt(best.pnlUsd)}` : '—', c: '#00cc66' },
          { l: 'Worst', v: worst ? `$${worst.coin} ${fmt(worst.pnlUsd)}` : '—', c: '#ff4444' },
          { l: 'Deployed', v: fmt(deployed), c: '#fff' },
          { l: 'Contributed', v: fmt(startingCapital + totalContrib), c: '#888' },
        ].map((x, i) => (
          <div key={i} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid #1a1a1a' }}>
            <span className="text-[12px] text-sub">{x.l}</span>
            <span className="text-[12px]" style={{ color: x.c }}>{x.v}</span>
          </div>
        ))}
      </Card>

      {narrStats.length > 0 && (
        <Card>
          <SectionHeader>Top Narratives</SectionHeader>
          {narrStats.slice(0, 3).map((n, i) => (
            <div key={i} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #1a1a1a' }}>
              <div>
                <span className="text-[13px] font-semibold">{n.name}</span>
                <span className="text-[10px] text-dim ml-2">{n.trades} trades · {n.wr.toFixed(0)}% WR</span>
              </div>
              <span className="text-[13px] font-bold" style={{ color: n.pnl >= 0 ? '#00cc66' : '#ff4444' }}>{fmt(n.pnl)}</span>
            </div>
          ))}
        </Card>
      )}

      <Card>
        <div className="flex justify-between mb-1.5">
          <span className="text-[10px] text-dim tracking-[1px] uppercase">Emergency Fund</span>
          <span className="text-[11px] text-sub">{fmt(emergency)}</span>
        </div>
        <div className="mb-2">
          <ProgressBar value={Math.min((emergency / (startingCapital * 0.5 || 2500)) * 100, 100)} color="#00cc66" />
        </div>
        <input
          type="number"
          value={emergency || ''}
          onChange={e => setEmergency(parseFloat(e.target.value) || 0)}
          placeholder="Update emergency fund"
          className="w-full px-3 py-[10px] rounded-lg border border-border bg-bg text-tx text-[13px] outline-none focus:border-sub box-border"
        />
      </Card>

      <Button onClick={() => setView('add')} className="mt-1">+ LOG A TRADE</Button>
    </div>
  )
}
