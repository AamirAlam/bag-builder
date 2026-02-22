import { useState } from 'react'
import { Stat } from '../ui/Stat'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { SectionHeader } from '../ui/SectionHeader'

const fmt = (n) => `$${Math.round(n).toLocaleString('en-US')}`

export function WalletView({ stables, contribs, trades, onSaveStable, onUpdateStable, onDeleteStable, onSaveContrib }) {
  const [sf, setSf] = useState({ label: '', amount: '' })
  const [cf, setCf] = useState({ date: new Date().toISOString().split('T')[0], amount: '', note: '' })

  const open = trades.filter(t => t.status === 'open')
  const totalStables = stables.reduce((a, s) => a + s.amount, 0)
  const openVal = open.reduce((a, t) => a + t.size, 0)
  const totalContrib = contribs.reduce((a, c) => a + c.amount, 0)

  const handleAddStable = async () => {
    if (!sf.label || !sf.amount) return
    await onSaveStable({ label: sf.label.toUpperCase(), amount: parseFloat(sf.amount) })
    setSf({ label: '', amount: '' })
  }

  const handleLogContrib = async () => {
    if (!cf.amount) return
    await onSaveContrib({ ...cf, amount: parseFloat(cf.amount) })
    setCf({ date: new Date().toISOString().split('T')[0], amount: '', note: '' })
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-1.5 mb-2.5">
        <Stat label="Stables" value={fmt(totalStables)} />
        <Stat label="Open Trades" value={fmt(openVal)} color="#ccaa00" />
      </div>

      <Card>
        <SectionHeader>Stables</SectionHeader>
        {stables.map(s => (
          <div key={s.id} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #1a1a1a' }}>
            <span className="font-semibold text-[13px]">{s.label}</span>
            <div className="flex gap-1.5 items-center">
              <input
                type="number"
                value={s.amount}
                onChange={e => onUpdateStable(s.id, parseFloat(e.target.value) || 0)}
                className="w-[90px] px-3 py-[10px] rounded-lg border border-border bg-bg text-tx text-[13px] outline-none text-right box-border"
              />
              <button onClick={() => onDeleteStable(s.id)} className="bg-transparent border-none text-dim cursor-pointer text-[14px] transition-colors duration-150 hover:text-red">✕</button>
            </div>
          </div>
        ))}
        {stables.length === 0 && (
          <p className="text-[12px] text-dim text-center py-4">No stablecoins tracked yet</p>
        )}
        <div className="grid grid-cols-2 gap-1.5 mt-2.5">
          <Input value={sf.label} placeholder="Token" onChange={e => setSf(p => ({ ...p, label: e.target.value }))} />
          <Input type="number" value={sf.amount} placeholder="Amount" onChange={e => setSf(p => ({ ...p, amount: e.target.value }))} />
        </div>
        <Button size="sm" onClick={handleAddStable} className="mt-1.5">ADD</Button>
      </Card>

      <Card>
        <SectionHeader>Contributions ({fmt(totalContrib)})</SectionHeader>
        {contribs.map(c => (
          <div key={c.id} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid #1a1a1a' }}>
            <span className="text-[11px] text-sub">{c.date}</span>
            <span className="text-[11px] text-green">
              +{fmt(c.amount)}{c.note && <span className="text-dim"> · {c.note}</span>}
            </span>
          </div>
        ))}
        {contribs.length === 0 && (
          <p className="text-[12px] text-dim text-center py-2">No contributions logged</p>
        )}
        <div className="grid grid-cols-3 gap-1.5 mt-2">
          <Input type="date" value={cf.date} onChange={e => setCf(p => ({ ...p, date: e.target.value }))} />
          <Input type="number" value={cf.amount} placeholder="1000" onChange={e => setCf(p => ({ ...p, amount: e.target.value }))} />
          <Input value={cf.note} placeholder="Note" onChange={e => setCf(p => ({ ...p, note: e.target.value }))} />
        </div>
        <Button size="sm" onClick={handleLogContrib} className="mt-1.5">LOG</Button>
      </Card>
    </div>
  )
}
