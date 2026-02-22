import { useState } from 'react'
import { HomeView } from './views/HomeView'
import { TradeView } from './views/TradeView'
import { WalletView } from './views/WalletView'
import { StatsView } from './views/StatsView'
import { RulesView } from './views/RulesView'
import { JournalView } from './views/JournalView'
import { Card } from './ui/Card'

const fmt = (n) => `$${Math.round(n).toLocaleString('en-US')}`

const DEFAULT_FORM = {
  date: new Date().toISOString().split('T')[0],
  coin: '', type: 'spot', entry: '', exit: '',
  size: '', leverage: '1', status: 'closed',
  notes: '', narrative: 'AI Agents', deductFrom: null,
  tp1: false, tp2: false,
}

export function MainApp({ userData, tradeData }) {
  const { settings } = tradeData
  const profile = settings?.profile_data || {}
  const userName = settings?.name || 'trader'
  const profileLabel = settings?.profile_label || 'Moderate'
  const maxPos = profile.maxPos || 4
  const levOk = profile.levOk || false

  const [view, setView] = useState('home')
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(DEFAULT_FORM)
  const [emergency, setEmergency] = useState(settings?.emergency_fund || 0)

  const { trades, stables, contribs, journal } = tradeData
  const closed = trades.filter(t => t.status === 'closed' && t.pnlUsd !== null)
  const open = trades.filter(t => t.status === 'open')
  const totalPnl = closed.reduce((a, t) => a + t.pnlUsd, 0)
  const totalStables = stables.reduce((a, s) => a + s.amount, 0)
  const openVal = open.reduce((a, t) => a + t.size, 0)
  const totalPort = totalStables + totalPnl + openVal
  const netWorth = totalPort + emergency

  const warnings = (() => {
    const w = []
    const l3 = closed.slice(-3)
    if (l3.length === 3 && l3.every(t => t.pnlUsd < 0)) w.push('3 losses in a row — STOP for 48 hours')
    if (!levOk && trades.some(t => t.type === 'futures')) w.push('Futures detected — your profile says spot only for now')
    const big = trades.filter(t => totalPort > 0 && t.size > totalPort * maxPos / 100)
    if (big.length) w.push(`${big.length} trade(s) over ${maxPos}% position limit`)
    return w
  })()

  const handleSaveTrade = async () => {
    if (!form.coin || !form.entry || !form.size) return
    const en = parseFloat(form.entry)
    const sz = parseFloat(form.size)
    const lv = parseInt(form.leverage)
    const ex = form.status === 'closed' ? parseFloat(form.exit) : null
    const pp = ex ? ((ex - en) / en) * 100 * lv : null
    const pu = pp !== null ? (pp / 100) * sz : null
    const trade = { date: form.date, coin: form.coin.toUpperCase(), type: form.type, entry: en, exit: ex, size: sz, leverage: lv, status: form.status, pnlPct: pp, pnlUsd: pu, notes: form.notes, narrative: form.narrative, tp1: form.tp1, tp2: form.tp2 }

    try {
      if (editId) {
        await tradeData.updateTrade(editId, trade)
      } else {
        await tradeData.saveTrade(trade, form.deductFrom)
      }
      setEditId(null)
      setForm(DEFAULT_FORM)
      setView('home')
    } catch (err) {
      console.error('Failed to save trade:', err)
    }
  }

  const handleEditTrade = (t) => {
    setEditId(t.id)
    setForm({ date: t.date, coin: t.coin, type: t.type, entry: String(t.entry), exit: t.exit ? String(t.exit) : '', size: String(t.size), leverage: String(t.leverage), status: t.status, notes: t.notes || '', narrative: t.narrative || 'Other', deductFrom: null, tp1: t.tp1 || false, tp2: t.tp2 || false })
    setView('add')
  }

  const tabs = [
    { key: 'home', label: 'Home' },
    { key: 'add', label: editId ? 'Edit' : '+ Trade' },
    { key: 'wallet', label: 'Wallet' },
    { key: 'stats', label: 'Stats' },
    { key: 'rules', label: 'Rules' },
    { key: 'journal', label: 'Journal' },
  ]

  return (
    <div className="min-h-screen bg-bg text-tx p-4">
      <div className="max-w-[720px] mx-auto">

        {/* Header */}
        <div className="text-center mb-4 pt-1.5">
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="text-[18px] font-black tracking-[-0.5px]">BagBuilder</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-alt text-dim border border-border">{profileLabel}</span>
          </div>
          <p className="text-[44px] font-extrabold m-0 leading-none">{fmt(netWorth)}</p>
          <p className="text-[11px] text-sub mt-1">Hi {userName} · Net Worth</p>
          <div className="flex justify-center gap-4 mt-2.5">
            {[
              { v: fmt(totalPort), l: 'Portfolio', c: undefined },
              { v: fmt(emergency), l: 'Emergency', c: emergency > 0 ? '#00cc66' : '#555' },
              { v: fmt(totalPnl), l: 'P&L', c: totalPnl >= 0 ? '#00cc66' : '#ff4444' },
            ].map((x, i) => (
              <div key={i} className="text-center">
                <p className="text-[15px] font-bold" style={{ color: x.c || '#fff' }}>{x.v}</p>
                <p className="text-[9px] text-dim">{x.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5 mb-3.5 bg-surface rounded-[10px] p-[3px] border border-border">
          {tabs.map(t => (
            <button key={t.key}
              onClick={() => { setView(t.key); if (t.key !== 'add') setEditId(null) }}
              className="flex-1 py-[9px] px-0.5 rounded-[7px] border-none cursor-pointer text-[10px] font-semibold transition-all duration-150"
              style={{ background: view === t.key ? '#fff' : 'transparent', color: view === t.key ? '#000' : '#888' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (view === 'home' || view === 'add') && (
          <Card accent="yellow" className="mb-2.5">
            {warnings.map((w, i) => <p key={i} className="text-yellow text-[11px] my-[3px]">⚠ {w}</p>)}
          </Card>
        )}

        {/* Views */}
        {view === 'home' && (
          <HomeView
            trades={trades}
            stables={stables}
            contribs={contribs}
            settings={settings}
            emergency={emergency}
            setEmergency={(val) => {
              setEmergency(val)
              tradeData.upsertUserSettings({ emergency_fund: val }).catch(() => {})
            }}
            setView={setView}
          />
        )}

        {view === 'add' && (
          <TradeView
            form={form}
            setForm={setForm}
            stables={stables}
            editId={editId}
            onSave={handleSaveTrade}
          />
        )}

        {view === 'wallet' && (
          <WalletView
            stables={stables}
            contribs={contribs}
            trades={trades}
            onSaveStable={tradeData.saveStable}
            onUpdateStable={tradeData.updateStable}
            onDeleteStable={tradeData.deleteStable}
            onSaveContrib={tradeData.saveContribution}
          />
        )}

        {view === 'stats' && (
          <StatsView
            trades={trades}
            onEdit={handleEditTrade}
            onDelete={tradeData.deleteTrade}
          />
        )}

        {view === 'rules' && (
          <RulesView maxPos={maxPos} levOk={levOk} />
        )}

        {view === 'journal' && (
          <JournalView
            journal={journal}
            onSave={tradeData.saveJournalEntry}
          />
        )}

      </div>
    </div>
  )
}
