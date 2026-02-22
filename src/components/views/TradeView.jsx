import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { SectionHeader } from '../ui/SectionHeader'
import { Pill } from '../ui/Pill'

const pf = (n) => `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`
const fmt = (n) => `$${Math.round(n).toLocaleString('en-US')}`

const NARR = ['AI Agents', 'Memecoins', 'DePIN', 'RWA', 'Gaming', 'L1/L2', 'DeFi', 'Privacy', 'Other']

export function TradeView({ form, setForm, stables, editId, onSave }) {
  const preview = (() => {
    if (!form.entry || !form.exit || !form.size || form.status !== 'closed') return null
    const p = ((parseFloat(form.exit) - parseFloat(form.entry)) / parseFloat(form.entry)) * parseFloat(form.leverage || 1) * 100
    const u = (p / 100) * parseFloat(form.size)
    return { p, u }
  })()

  return (
    <Card>
      <SectionHeader>{editId ? 'Edit Trade' : 'New Trade'}</SectionHeader>

      <div className="grid grid-cols-2 gap-2">
        {[
          { k: 'date', l: 'Date', t: 'date' },
          { k: 'coin', l: 'Coin', t: 'text', ph: 'BTC' },
          { k: 'entry', l: 'Entry', t: 'number', ph: '0.0045' },
          { k: 'exit', l: 'Exit', t: 'number', ph: '0.009' },
          { k: 'size', l: 'Size ($)', t: 'number', ph: '150' },
          { k: 'leverage', l: 'Leverage', t: 'number', ph: '1' },
        ].map(f => (
          <div key={f.k}>
            <Label>{f.l}</Label>
            <Input type={f.t} value={form[f.k]} placeholder={f.ph || ''} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} />
          </div>
        ))}
      </div>

      <div className="mt-2">
        <Label>Narrative</Label>
        <div className="flex flex-wrap gap-1">
          {NARR.map(n => (
            <Pill key={n} active={form.narrative === n} onClick={() => setForm(p => ({ ...p, narrative: n }))}>{n}</Pill>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <div>
          <Label>Type</Label>
          <div className="flex gap-1">
            {['spot', 'futures'].map(t => (
              <Pill key={t} active={form.type === t} onClick={() => setForm(p => ({ ...p, type: t, leverage: t === 'spot' ? '1' : p.leverage }))}>
                {t.toUpperCase()}
              </Pill>
            ))}
          </div>
        </div>
        <div>
          <Label>Status</Label>
          <div className="flex gap-1">
            {['closed', 'open'].map(s => (
              <Pill key={s} active={form.status === s} onClick={() => setForm(p => ({ ...p, status: s }))}>
                {s.toUpperCase()}
              </Pill>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 p-3 bg-alt rounded-lg">
        <Label>Profit-taking followed?</Label>
        <div className="flex gap-3 mt-1">
          {[{ k: 'tp1', l: '50% at 2x' }, { k: 'tp2', l: '25% at 3x' }].map(tp => (
            <label key={tp.k} className="flex items-center gap-1.5 cursor-pointer text-[12px]"
              style={{ color: form[tp.k] ? '#00cc66' : '#888' }}>
              <div
                onClick={() => setForm(p => ({ ...p, [tp.k]: !p[tp.k] }))}
                className="w-[18px] h-[18px] rounded-[4px] flex items-center justify-center cursor-pointer transition-all duration-150"
                style={{
                  border: `1px solid ${form[tp.k] ? '#00cc66' : '#1a1a1a'}`,
                  background: form[tp.k] ? '#00cc66' : 'transparent'
                }}>
                {form[tp.k] && <span className="text-bg text-[11px] font-bold">✓</span>}
              </div>
              {tp.l}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-2">
        <Label>Notes</Label>
        <Input value={form.notes} placeholder="What happened..." onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
      </div>

      {form.size && stables.length > 0 && !editId && (
        <div className="mt-2">
          <Label>Deduct from</Label>
          <div className="flex gap-1 flex-wrap">
            <Pill active={!form.deductFrom} onClick={() => setForm(p => ({ ...p, deductFrom: null }))}>None</Pill>
            {stables.map(s => (
              <Pill key={s.id} active={form.deductFrom === s.id} onClick={() => setForm(p => ({ ...p, deductFrom: s.id }))}>
                {s.label} (${Math.round(s.amount)})
              </Pill>
            ))}
          </div>
        </div>
      )}

      {preview && (
        <div className="mt-2.5 p-3 bg-alt rounded-lg text-center">
          <p className="text-[9px] text-dim tracking-[1px]">PREVIEW</p>
          <p className="text-[24px] font-bold" style={{ color: preview.p >= 0 ? '#00cc66' : '#ff4444' }}>{pf(preview.p)}</p>
          <p className="text-[13px]" style={{ color: preview.p >= 0 ? '#00cc66' : '#ff4444' }}>{fmt(preview.u)}</p>
        </div>
      )}

      <Button onClick={onSave} className="mt-2.5">{editId ? 'UPDATE' : 'LOG TRADE'}</Button>
    </Card>
  )
}
