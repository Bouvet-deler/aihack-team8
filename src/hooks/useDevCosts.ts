import { useState, useEffect } from 'react'

interface Session {
  date: string
  description: string
  inputTokens?: number
  outputTokens?: number
  premiumRequests?: number
  costUSD: number
}

interface Developer {
  tool: string
  model: string
  sessions: Session[]
}

interface DevCosts {
  developers: Record<string, Developer>
  totalAIcostUSD: number
  totalInfraCostUSD: number
  totalNOK: number
  sessionCount: number
}

export function useDevCosts(): DevCosts | null {
  const [data, setData] = useState<DevCosts | null>(null)

  useEffect(() => {
    fetch('/dev-costs.json')
      .then((r) => r.json())
      .then((json) => {
        const usdToNok: number = json.usdToNok ?? 10.5
        const devs = json.developers ?? {}

        const totalAIcostUSD = Object.values(devs).reduce(
          (sum: number, dev) =>
            sum +
            ((dev as Developer).sessions ?? []).reduce(
              (s: number, sess: Session) => s + sess.costUSD,
              0
            ),
          0
        )

        const infra = json.infrastructure ?? {}
        const totalInfraCostUSD =
          (infra.githubActions?.costUSD ?? 0) +
          (infra.copilotSeats?.costUSD ?? 0) +
          (infra.hosting?.costUSD ?? 0)

        const sessionCount = Object.values(devs).reduce(
          (sum: number, dev) => sum + ((dev as Developer).sessions ?? []).length,
          0
        )

        const totalUSD = totalAIcostUSD + totalInfraCostUSD
        setData({
          developers: devs,
          totalAIcostUSD,
          totalInfraCostUSD,
          totalNOK: totalUSD * usdToNok,
          sessionCount,
        })
      })
      .catch(() => {
        /* silently ignore */
      })
  }, [])

  return data
}
