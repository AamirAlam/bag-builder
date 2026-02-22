import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    
    async function initAuth() {
      console.log('=== INIT AUTH START ===')
      
      try {
        // First, try to get any existing session
        console.log('Checking for existing session...')
        const sessionResult = await supabase.auth.getSession()
        console.log('Session result:', sessionResult)
        
        if (!mounted) return
        
        const { data: { session: existingSession }, error: sessionError } = sessionResult
        
        if (sessionError) {
          console.error('Session error:', sessionError)
        }
        
        if (existingSession && existingSession.user) {
          console.log('Found existing session:', existingSession.user.id)
          console.log('Access token exists:', !!existingSession.access_token)
          setSession(existingSession)
          setUser(existingSession.user)
          setLoading(false)
          return
        }

        console.log('No existing session, attempting anonymous sign-in...')
        const signInResult = await supabase.auth.signInAnonymously()
        console.log('Sign in result:', signInResult)
        
        if (!mounted) return
        
        const { data, error: signInError } = signInResult
        
        if (signInError) {
          console.error('Anonymous sign in error:', signInError)
          
          // Check if anonymous sign-ins are disabled
          if (signInError.code === 'anonymous_provider_disabled') {
            const errorMsg = 'Anonymous authentication is disabled. Please enable it in Supabase Dashboard → Authentication → Providers → Anonymous'
            console.error(errorMsg)
            setError(errorMsg)
          }
          setLoading(false)
          return
        }

        // Check what we got back
        console.log('Sign in data:', {
          hasSession: !!data?.session,
          hasUser: !!data?.user,
          sessionUser: data?.session?.user?.id,
          userId: data?.user?.id,
          hasAccessToken: !!data?.session?.access_token
        })

        if (data?.session) {
          console.log('Anonymous sign in successful with session:', data.session.user.id)
          setSession(data.session)
          setUser(data.session.user)
        } else if (data?.user) {
          console.log('User created, setting user:', data.user.id)
          setUser(data.user)
          
          // Try to get the session
          const { data: sessionData } = await supabase.auth.getSession()
          if (sessionData.session && mounted) {
            console.log('Got session after user:', sessionData.session.user.id)
            setSession(sessionData.session)
          }
        }
      } catch (err) {
        console.error('Auth init error:', err)
        setError(err.message)
      }
      
      if (mounted) {
        setLoading(false)
        console.log('=== INIT AUTH END ===')
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, 'user:', session?.user?.id, 'has token:', !!session?.access_token)
      if (session && mounted) {
        setSession(session)
        setUser(session.user)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return { session, user, loading, error }
}
