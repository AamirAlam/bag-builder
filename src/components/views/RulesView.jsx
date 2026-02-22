import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { SectionHeader } from '../ui/SectionHeader'

export function RulesView({ maxPos, levOk }) {
  const [checks, setChecks] = useState({})

  const RULES = [
    { id: 'tp1', rule: 'Sell 50% at 2x', desc: 'Lock in your initial investment' },
    { id: 'tp2', rule: 'Sell 25% more at 3x', desc: 'Secure additional profit' },
    { id: 'sl', rule: 'Stop loss at -15%', desc: 'Max loss per trade, no exceptions' },
    { id: 'size', rule: `Max ${maxPos}% per position`, desc: 'Based on your risk profile' },
    { id: 'lev', rule: levOk ? 'Max 3-5X leverage, isolated only' : 'NO leverage yet', desc: levOk ? 'Never use cross margin' : '6 months profitable in spot first' },
    { id: 'log', rule: 'Log every trade', desc: 'What gets measured gets managed' },
    { id: 'pause', rule: '3 losses → 48hr pause', desc: 'Break the emotional spiral' },
    { id: 'chase', rule: 'Never chase a missed entry', desc: "There's always another trade" },
  ]

  const allChecked = RULES.every(r => checks[r.id])

  return (
    <div>
      <Card>
        <SectionHeader>Pre-Trade Checklist</SectionHeader>
        <p className="text-[11px] text-sub mb-3">Check every one before entering a trade</p>
        {RULES.map(r => (
          <div key={r.id} className="flex items-start gap-2.5 py-2.5" style={{ borderBottom: '1px solid #1a1a1a' }}>
            <div
              onClick={() => setChecks(p => ({ ...p, [r.id]: !p[r.id] }))}
              className="w-5 h-5 rounded-[5px] flex items-center justify-center cursor-pointer flex-shrink-0 transition-all duration-150"
              style={{
                border: `1px solid ${checks[r.id] ? '#00cc66' : '#1a1a1a'}`,
                background: checks[r.id] ? '#00cc66' : 'transparent',
              }}>
              {checks[r.id] && <span className="text-bg text-[11px] font-bold">✓</span>}
            </div>
            <div>
              <p className="text-[13px] font-semibold" style={{ color: checks[r.id] ? '#00cc66' : '#fff' }}>{r.rule}</p>
              <p className="text-[11px] text-dim mt-0.5">{r.desc}</p>
            </div>
          </div>
        ))}
      </Card>

      {allChecked && RULES.length > 0 && (
        <Card accent="green">
          <p className="text-[13px] font-semibold text-green">All checks passed — you're ready to trade.</p>
        </Card>
      )}

      <Button variant="ghost" onClick={() => setChecks({})}>RESET CHECKLIST</Button>
    </div>
  )
}
