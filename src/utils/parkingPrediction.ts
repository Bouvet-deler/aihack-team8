/**
 * Rule-based parking availability prediction.
 * Models typical Norwegian urban parking patterns by hour and day type.
 * Returns predicted free-spot ratios anchored to current actual occupancy.
 */

// Typical occupancy curve (0 = empty, 1 = full) for a weekday
const WEEKDAY_CURVE: Record<number, number> = {
  0: 0.05, 1: 0.03, 2: 0.03, 3: 0.03, 4: 0.05,
  5: 0.10, 6: 0.25, 7: 0.55, 8: 0.80, 9: 0.85,
  10: 0.80, 11: 0.85, 12: 0.90, 13: 0.85, 14: 0.80,
  15: 0.85, 16: 0.90, 17: 0.85, 18: 0.65, 19: 0.45,
  20: 0.30, 21: 0.20, 22: 0.12, 23: 0.08,
}

// Weekend curve — later start, flatter peak
const WEEKEND_CURVE: Record<number, number> = {
  0: 0.10, 1: 0.08, 2: 0.08, 3: 0.05, 4: 0.05,
  5: 0.05, 6: 0.08, 7: 0.12, 8: 0.20, 9: 0.35,
  10: 0.50, 11: 0.65, 12: 0.75, 13: 0.75, 14: 0.72,
  15: 0.70, 16: 0.68, 17: 0.60, 18: 0.55, 19: 0.45,
  20: 0.35, 21: 0.25, 22: 0.18, 23: 0.14,
}

function getCurve(date: Date): Record<number, number> {
  const day = date.getDay()
  return day === 0 || day === 6 ? WEEKEND_CURVE : WEEKDAY_CURVE
}

export interface PredictionPoint {
  hour: number          // 0-23
  label: string         // "Nå", "14:00", etc.
  predictedFree: number // absolute predicted free spots
  capacity: number
  confidence: number    // 0-1
}

export function getPredictions(
  currentFree: number,
  capacity: number,
  hoursAhead = 8,
): PredictionPoint[] {
  if (capacity <= 0) return []

  const now = new Date()
  const currentHour = now.getHours()
  const currentOccupancy = 1 - currentFree / capacity

  const curve = getCurve(now)
  const curveAtNow = curve[currentHour] ?? 0.5

  // Scale factor anchors the prediction curve to the current real reading
  const scale = curveAtNow > 0 ? currentOccupancy / curveAtNow : 1

  const points: PredictionPoint[] = []

  for (let i = 0; i < hoursAhead; i++) {
    const targetDate = new Date(now.getTime() + i * 3600_000)
    const hour = targetDate.getHours()
    const targetCurve = getCurve(targetDate)
    const rawOccupancy = (targetCurve[hour] ?? 0.5) * scale
    const clampedOccupancy = Math.max(0, Math.min(1, rawOccupancy))
    const predictedFree = Math.round((1 - clampedOccupancy) * capacity)

    // Confidence decays with time and is lower at peak hours where variance is high
    const peakPenalty = rawOccupancy > 0.75 ? 0.15 : 0
    const timePenalty = i * 0.05
    const confidence = Math.max(0.3, 0.95 - timePenalty - peakPenalty)

    const label = i === 0
      ? 'now'
      : `${String(hour).padStart(2, '0')}:00`

    points.push({ hour, label, predictedFree, capacity, confidence })
  }

  return points
}

export function getBestHour(points: PredictionPoint[]): PredictionPoint | null {
  if (points.length === 0) return null
  return points.reduce((best, p) => p.predictedFree > best.predictedFree ? p : best)
}
