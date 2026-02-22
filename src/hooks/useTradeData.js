import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase'

const DEFAULT_FORM = {
  date: new Date().toISOString().split('T')[0],
  coin: '', type: 'spot', entry: '', exit: '',
  size: '', leverage: '1', status: 'closed',
  notes: '', narrative: 'AI Agents', deductFrom: null,
  tp1: false, tp2: false,
}

export function useTradeData(userId) {
  const [trades, setTrades] = useState([])
  const [stables, setStables] = useState([])
  const [contribs, setContribs] = useState([])
  const [journal, setJournal] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  // Refresh session before each database operation to ensure token is valid
  const refreshSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      console.warn('No session found, attempting refresh...')
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        console.error('Session refresh failed:', error)
      }
      return data?.session
    }
    return session
  }, [])

  const loadAllData = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      await refreshSession()
      const [tradesRes, stablesRes, contribsRes, journalRes, settingsRes] = await Promise.all([
        supabase.from('trades').select('*').eq('auth_user_id', userId).order('date', { ascending: false }),
        supabase.from('stables').select('*').eq('auth_user_id', userId),
        supabase.from('contributions').select('*').eq('auth_user_id', userId).order('date', { ascending: false }),
        supabase.from('journal').select('*').eq('auth_user_id', userId).order('created_at', { ascending: false }),
        supabase.from('users').select('*').eq('auth_user_id', userId).single(),
      ])
      if (tradesRes.data) setTrades(tradesRes.data.map(normalizeTradeFromDb))
      if (stablesRes.data) setStables(stablesRes.data)
      if (contribsRes.data) setContribs(contribsRes.data)
      if (journalRes.data) setJournal(journalRes.data)
      if (settingsRes.data) setSettings(settingsRes.data)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadAllData()
  }, [loadAllData])

  // --- Trades ---
  const saveTrade = useCallback(async (trade, stableIdToDeduct) => {
    const row = normalizeTradeToDb(trade, userId)
    const { data, error } = await supabase.from('trades').insert(row).select().single()
    if (error) throw error
    setTrades(prev => [normalizeTradeFromDb(data), ...prev])
    if (stableIdToDeduct) {
      setStables(prev => prev.map(s =>
        s.id === stableIdToDeduct ? { ...s, amount: Math.max(0, s.amount - trade.size) } : s
      ))
      await supabase.from('stables').update({
        amount: Math.max(0, (stables.find(s => s.id === stableIdToDeduct)?.amount || 0) - trade.size)
      }).eq('id', stableIdToDeduct)
    }
    return data
  }, [userId, stables])

  const updateTrade = useCallback(async (id, trade) => {
    const row = normalizeTradeToDb(trade, userId)
    const { data, error } = await supabase.from('trades').update(row).eq('id', id).select().single()
    if (error) throw error
    setTrades(prev => prev.map(t => t.id === id ? normalizeTradeFromDb(data) : t))
    return data
  }, [userId])

  const deleteTrade = useCallback(async (id) => {
    const { error } = await supabase.from('trades').delete().eq('id', id)
    if (error) throw error
    setTrades(prev => prev.filter(t => t.id !== id))
  }, [])

  // --- Stables ---
  const saveStable = useCallback(async (stable) => {
    const { data, error } = await supabase.from('stables')
      .insert({ auth_user_id: userId, label: stable.label, amount: stable.amount })
      .select().single()
    if (error) throw error
    setStables(prev => [...prev, data])
    return data
  }, [userId])

  const updateStable = useCallback(async (id, amount) => {
    const { error } = await supabase.from('stables').update({ amount }).eq('id', id)
    if (error) throw error
    setStables(prev => prev.map(s => s.id === id ? { ...s, amount } : s))
  }, [])

  const deleteStable = useCallback(async (id) => {
    const { error } = await supabase.from('stables').delete().eq('id', id)
    if (error) throw error
    setStables(prev => prev.filter(s => s.id !== id))
  }, [])

  // --- Contributions ---
  const saveContribution = useCallback(async (contrib) => {
    const { data, error } = await supabase.from('contributions')
      .insert({ auth_user_id: userId, date: contrib.date, amount: contrib.amount, note: contrib.note })
      .select().single()
    if (error) throw error
    setContribs(prev => [data, ...prev])
    return data
  }, [userId])

  // --- Journal ---
  const saveJournalEntry = useCallback(async (entry) => {
    const { data, error } = await supabase.from('journal')
      .insert({ auth_user_id: userId, date: entry.date, text: entry.text })
      .select().single()
    if (error) throw error
    setJournal(prev => [data, ...prev])
    return data
  }, [userId])

  // --- User Settings ---
  const upsertUserSettings = useCallback(async (newSettings) => {
    // Ensure we have a valid session before making the request
    const session = await refreshSession()
    
    console.log('=== DEBUG SESSION INFO ===')
    console.log('Session:', session)
    console.log('Access token:', session?.access_token?.substring(0, 20) + '...')
    console.log('User ID from session:', session?.user?.id)
    console.log('User ID passed to function:', userId)
    console.log('Settings:', newSettings)
    console.log('========================')

    if (!session?.access_token) {
      console.error('No access token available! Session:', session)
      throw new Error('No valid session. Please refresh the page and try again.')
    }
    
    const { data, error } = await supabase.from('users')
      .upsert({ auth_user_id: userId, ...newSettings }, { onConflict: 'auth_user_id' })
      .select().single()
    
    if (error) {
      console.error('Error upserting user settings:', error)
      throw error
    }
    console.log('User settings saved:', data)
    setSettings(data)
    return data
  }, [userId, refreshSession])

  return {
    trades, stables, contribs, journal, settings,
    loading, loadAllData,
    saveTrade, updateTrade, deleteTrade,
    saveStable, updateStable, deleteStable,
    saveContribution, saveJournalEntry, upsertUserSettings,
    DEFAULT_FORM,
  }
}

function normalizeTradeToDb(t, userId) {
  return {
    auth_user_id: userId,
    date: t.date,
    coin: t.coin,
    type: t.type,
    entry: t.entry,
    exit: t.exit,
    size: t.size,
    leverage: t.leverage,
    status: t.status,
    pnl_pct: t.pnlPct,
    pnl_usd: t.pnlUsd,
    notes: t.notes,
    narrative: t.narrative,
    tp1: t.tp1,
    tp2: t.tp2,
  }
}

function normalizeTradeFromDb(row) {
  return {
    id: row.id,
    date: row.date,
    coin: row.coin,
    type: row.type,
    entry: row.entry,
    exit: row.exit,
    size: row.size,
    leverage: row.leverage,
    status: row.status,
    pnlPct: row.pnl_pct,
    pnlUsd: row.pnl_usd,
    notes: row.notes,
    narrative: row.narrative,
    tp1: row.tp1,
    tp2: row.tp2,
  }
}
