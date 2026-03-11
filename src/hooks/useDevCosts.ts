import devCostsJson from '../../public/dev-costs.json'

interface Session {
  costUSD: number
}

interface Developer {
  sessions: Session[]
}

interface DevCosts {
  totalNOK: number
  sessionCount: number
}

export function useDevCosts(): DevCosts {
  const json = devCostsJson as Record<string, unknown>
  const usdToNok = (json.usdToNok as number) ?? 10.5
  const devs = (json.developers ?? {}) as Record<string, Developer>

  const totalAIcostUSD = Object.values(devs).reduce(
    (sum, dev) => sum + (dev.sessions ?? []).reduce((s, sess) => s + sess.costUSD, 0),
    0
  )

  const infra = json.infrastructure as Record<string, { costUSD?: number }> | undefined
  const totalInfraCostUSD = infra
    ? Object.values(infra).reduce((sum, v) => sum + (v.costUSD ?? 0), 0)
    : 0

  const sessionCount = Object.values(devs).reduce(
    (sum, dev) => sum + (dev.sessions ?? []).length,
    0
  )

  const totalUSD = totalAIcostUSD + totalInfraCostUSD
  return { totalNOK: totalUSD * usdToNok, sessionCount }
}
