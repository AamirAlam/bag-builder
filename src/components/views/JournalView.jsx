import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { SectionHeader } from '../ui/SectionHeader'

export function JournalView({ journal, onSave }) {
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!text.trim()) return
    setSaving(true)
    await onSave({ date: new Date().toISOString().split('T')[0], text })
    setText('')
    setSaving(false)
  }

  return (
    <div>
      <Card>
        <SectionHeader>Trading Journal</SectionHeader>
        <Input
          type="textarea"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="What happened today? How do you feel? Did you follow your rules?"
        />
        <Button onClick={handleSave} disabled={saving || !text.trim()} className="mt-2">
          {saving ? 'SAVING...' : 'SAVE'}
        </Button>
      </Card>

      {journal.map(j => (
        <Card key={j.id} accent="border">
          <p className="text-[10px] text-dim mb-1.5">{j.date}</p>
          <p className="text-[12px] text-sub leading-relaxed whitespace-pre-wrap">{j.text}</p>
        </Card>
      ))}

      {journal.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-dim">Start journaling — your future self will thank you</p>
        </Card>
      )}
    </div>
  )
}
