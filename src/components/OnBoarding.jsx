import { useState } from 'react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'

const fmt = (n) => `$${Math.round(n).toLocaleString('en-US')}`

const STEPS = [
  { key: 'welcome', type: 'welcome' },
  { key: 'name', q: 'What should we call you?', type: 'text', field: 'name', placeholder: 'Your name or alias' },
  { key: 'experience', q: 'How much crypto trading experience do you have?', type: 'select', field: 'experience', opts: ['Complete beginner', 'A few months', '1+ year', 'Experienced (but need discipline)'] },
  { key: 'capital', q: 'How much capital are you starting with?', type: 'select', field: 'capital', opts: ['Under $500', '$500 - $2,000', '$2,000 - $5,000', '$5,000 - $20,000', '$20,000+'] },
  { key: 'monthly', q: 'How much can you add monthly from income?', type: 'select', field: 'monthly', opts: ['$0 — no extra income', 'Under $500', '$500 - $1,000', '$1,000 - $2,000', '$2,000+'] },
  { key: 'expenses', q: 'What are your monthly living expenses?', type: 'select', field: 'expenses', opts: ['Under $500', '$500 - $1,000', '$1,000 - $2,000', '$2,000 - $4,000', '$4,000+'] },
  { key: 'risk', q: "What's your risk tolerance?", type: 'select', field: 'risk', opts: ['Conservative — protect capital above all', 'Moderate — balanced growth and safety', 'Aggressive — willing to take bigger risks'] },
  { key: 'leverage', q: 'Have you used leverage (futures) before?', type: 'select', field: 'leverage', opts: ['Never', "Yes, and I've been liquidated", 'Yes, profitably', "I don't know what leverage is"] },
  { key: 'goal', q: "What's your 12-month portfolio goal?", type: 'select', field: 'goal', opts: ['$5,000 - $10,000', '$10,000 - $25,000', '$25,000 - $50,000', '$50,000 - $100,000', '$100,000+'] },
  { key: 'summary', type: 'summary' },
]

function getRiskProfile(answers) {
  const r = answers.risk
  if (r?.includes('Conservative')) return { label: 'Conservative', color: '#00cc66', spotPct: 85, futPct: 0, reservePct: 15, maxPos: 3, levOk: false }
  if (r?.includes('Aggressive')) return { label: 'Aggressive', color: '#ff4444', spotPct: 70, futPct: 15, reservePct: 15, maxPos: 5, levOk: !answers.leverage?.includes('liquidated') && !answers.leverage?.includes('Never') && !answers.leverage?.includes("don't know") }
  return { label: 'Moderate', color: '#ccaa00', spotPct: 75, futPct: 10, reservePct: 15, maxPos: 4, levOk: false }
}

function getCapitalNum(answers) {
  const m = { 'Under $500': 300, '$500 - $2,000': 1000, '$2,000 - $5,000': 3500, '$5,000 - $20,000': 10000, '$20,000+': 25000 }
  return m[answers.capital] || 1000
}

export function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({ name: '', capital: '', monthly: '', expenses: '', risk: '', experience: '', goal: '', leverage: '' })
  const [saving, setSaving] = useState(false)

  const s = STEPS[step]
  const canNext = s.type === 'welcome' || s.type === 'summary' || (s.type === 'text' ? answers[s.field]?.trim() : answers[s.field])
  const profile = getRiskProfile(answers)
  const cap = getCapitalNum(answers)

  const handleComplete = async () => {
    setSaving(true)
    await onComplete({ ...answers, profile, capital: cap })
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-bg text-tx flex items-center justify-center p-5">
      <div className="max-w-[480px] w-full">

        {/* Progress */}
        <div className="flex gap-[3px] mb-[30px]">
          {STEPS.map((_, i) => (
            <div key={i} className="flex-1 h-[3px] rounded-[2px] transition-all duration-300"
              style={{ background: i <= step ? '#fff' : '#333' }} />
          ))}
        </div>

        {/* Welcome */}
        {s.type === 'welcome' && (
          <div className="text-center">
            <div className="mb-[30px]">
              <p className="text-[13px] tracking-[4px] text-dim uppercase mb-3">Welcome to</p>
              <h1 className="text-[48px] font-black m-0 leading-none tracking-[-1px]">BagBuilder</h1>
              <p className="text-[14px] text-sub mt-3 leading-relaxed">Your crypto trading companion.<br />Built by traders who learned the hard way.</p>
            </div>
            <Card className="text-left mb-5">
              {['Track every trade with discipline', 'Follow proven profit-taking rules', 'Build wealth, not gambling habits', 'Know which narratives make you money'].map((t, i) => (
                <p key={i} className="text-[13px] text-sub py-2 flex items-center gap-2" style={{ borderBottom: i < 3 ? '1px solid #1a1a1a' : 'none' }}>
                  <span className="text-tx text-[10px]">✦</span> {t}
                </p>
              ))}
            </Card>
          </div>
        )}

        {/* Text Input */}
        {s.type === 'text' && (
          <div>
            <p className="text-[20px] font-bold mb-5 leading-snug">{s.q}</p>
            <input
              type="text"
              value={answers[s.field] || ''}
              placeholder={s.placeholder}
              autoFocus
              onChange={e => setAnswers(p => ({ ...p, [s.field]: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && canNext && setStep(step + 1)}
              className="w-full px-4 py-4 rounded-xl border border-border bg-bg text-tx text-[18px] outline-none focus:border-sub box-border transition-colors duration-150"
            />
          </div>
        )}

        {/* Select */}
        {s.type === 'select' && (
          <div>
            <p className="text-[20px] font-bold mb-5 leading-snug">{s.q}</p>
            <div className="flex flex-col gap-2">
              {s.opts.map(o => (
                <button key={o}
                  onClick={() => { setAnswers(p => ({ ...p, [s.field]: o })); setTimeout(() => setStep(step + 1), 200) }}
                  className="px-4 py-4 rounded-[10px] text-[14px] cursor-pointer text-left transition-all duration-150"
                  style={{
                    border: `1px solid ${answers[s.field] === o ? '#fff' : '#1a1a1a'}`,
                    background: answers[s.field] === o ? '#fff' : '#0a0a0a',
                    color: answers[s.field] === o ? '#000' : '#888',
                    fontWeight: answers[s.field] === o ? 600 : 400,
                  }}>
                  {o}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        {s.type === 'summary' && (
          <div>
            <p className="text-[24px] font-extrabold mb-1">You're all set, {answers.name || 'trader'}.</p>
            <p className="text-[13px] text-sub mb-5">Here's your personalized plan:</p>

            <Card accent={profile.label === 'Conservative' ? 'green' : profile.label === 'Aggressive' ? 'red' : 'yellow'}>
              <p className="text-[10px] text-dim tracking-[1px] uppercase mb-1.5">Risk Profile</p>
              <p className="text-[20px] font-bold" style={{ color: profile.color }}>{profile.label}</p>
            </Card>

            <Card>
              <p className="text-[10px] text-dim tracking-[1px] uppercase mb-2.5">Recommended Allocation</p>
              {[
                { label: 'Spot Trading', pct: profile.spotPct, amt: cap * profile.spotPct / 100 },
                ...(profile.futPct > 0 ? [{ label: 'Futures (careful)', pct: profile.futPct, amt: cap * profile.futPct / 100 }] : []),
                { label: 'Emergency Reserve', pct: profile.reservePct, amt: cap * profile.reservePct / 100 },
              ].map((a, i) => (
                <div key={i} className="flex justify-between py-2" style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <span className="text-[13px] text-sub">{a.label} ({a.pct}%)</span>
                  <span className="text-[13px] font-semibold">{fmt(a.amt)}</span>
                </div>
              ))}
            </Card>

            <Card>
              <p className="text-[10px] text-dim tracking-[1px] uppercase mb-2.5">Your Rules</p>
              {[
                `Max position: ${profile.maxPos}% of portfolio per trade`,
                'Sell 50% at 2x, 25% more at 3x',
                'Stop loss at -15% always',
                profile.levOk ? 'Futures: max 3-5X, isolated margin only' : 'NO leverage until 6 months profitable in spot',
                '3 losses in a row → 48hr break',
                'Log every trade',
              ].map((r, i) => (
                <p key={i} className="text-[12px] text-sub py-1.5" style={{ borderBottom: '1px solid #1a1a1a' }}>{i + 1}. {r}</p>
              ))}
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex gap-2">
          {step > 0 && (
            <Button variant="ghost" fullWidth={false} onClick={() => setStep(step - 1)} className="w-[100px]">
              Back
            </Button>
          )}
          {s.type !== 'select' && (
            <Button
              onClick={() => {
                if (s.type === 'summary') handleComplete()
                else if (canNext) setStep(step + 1)
              }}
              disabled={!canNext || saving}
              className="flex-1"
            >
              {saving ? 'Saving...' : s.type === 'summary' ? 'Start Building' : s.type === 'welcome' ? "Let's Go" : 'Continue'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
