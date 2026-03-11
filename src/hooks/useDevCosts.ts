import { useState, useEffect } from 'react'

interface Session {
  date: string
  description: string
  inputTokens: number
  outputTokens: number
  costUSD: number
}

interface DevCosts {
  sessions: Session[]
  totalNOK: number
}

export function useDevCosts(): DevCosts | null {
  const [data, setData] = useState<DevCosts | null>(null)

  useEffect(() => {
    fetch('/dev-costs.json')
      .then((r) => r.json())
      .then((json) => {
        const usdToNok: number = json.usdToNok ?? 10.5
        const totalUSD = (json.sessions as Session[]).reduce((sum, s) => sum + s.costUSD, 0)
        setData({ sessions: json.sessions, totalNOK: totalUSD * usdToNok })
      })
      .catch(() => {/* silently ignore */})
  }, [])

  return data
}
