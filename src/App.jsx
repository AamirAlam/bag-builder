import { useAuth } from './hooks/useAuth'
import { useTradeData } from './hooks/useTradeData'
import { Onboarding } from './components/OnBoarding'
import { MainApp } from './components/MainApp'

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <p className="text-[18px] font-black tracking-[-0.5px] mb-2">BagBuilder</p>
        <p className="text-[11px] text-dim">Loading...</p>
      </div>
    </div>
  )
}

export default function App() {
  const { user, loading: authLoading } = useAuth()
  const tradeData = useTradeData(user?.id)

  if (authLoading || (user && tradeData.loading)) {
    return <LoadingScreen />
  }

  // Wait for user to be available before showing onboarding
  if (!user) {
    return <LoadingScreen />
  }

  const isOnboarded = !!tradeData.settings

  if (!isOnboarded) {
    return (
      <Onboarding
        onComplete={async (answers) => {
          try {
            const profileData = {
              spotPct: answers.profile.spotPct,
              futPct: answers.profile.futPct,
              reservePct: answers.profile.reservePct,
              maxPos: answers.profile.maxPos,
              levOk: answers.profile.levOk,
              capital: answers.capital,
            }
            await tradeData.upsertUserSettings({
              name: answers.name,
              profile_label: answers.profile.label,
              profile_data: profileData,
              emergency_fund: answers.capital * answers.profile.reservePct / 100,
            })

            // Create initial USDC stable
            if (answers.capital > 0) {
              await tradeData.saveStable({
                label: 'USDC',
                amount: answers.capital * answers.profile.spotPct / 100,
              })
            }
          } catch (err) {
            console.error('Onboarding error:', err)
            alert('Failed to save settings: ' + err.message)
          }
        }}
      />
    )
  }

  return <MainApp userData={user} tradeData={tradeData} />
}
