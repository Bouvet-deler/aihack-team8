import { useTranslation } from 'react-i18next'
import { getPredictions, getBestHour } from '../utils/parkingPrediction'
import { getColor } from './ParkingMarker'

interface PredictionChartProps {
  currentFree: number
  /** Estimated capacity. When unknown, we estimate from currentFree. */
  capacity?: number
}

const CHART_W = 232
const CHART_H = 72
const BAR_GAP = 2

/** Estimate total capacity when the API doesn't provide it */
function estimateCapacity(currentFree: number): number {
  // Assume current free spots represent ~40-60% of capacity at median hour
  return Math.max(currentFree * 2, 50)
}

export function PredictionChart({ currentFree, capacity }: PredictionChartProps) {
  const { t } = useTranslation()
  const cap = capacity ?? estimateCapacity(currentFree)
  const points = getPredictions(currentFree, cap, 8)
  const best = getBestHour(points)

  if (points.length === 0) return null

  const barW = (CHART_W - BAR_GAP * (points.length - 1)) / points.length

  return (
    <div style={{ marginTop: '10px', borderTop: '1px solid #e0e0e0', paddingTop: '8px' }}>
      <div style={{ fontSize: '11px', fontWeight: 600, color: '#565656', marginBottom: '4px' }}>
        {t('prediction.title')}
      </div>

      <svg width={CHART_W} height={CHART_H + 16} style={{ display: 'block', overflow: 'visible' }}>
        {points.map((p, i) => {
          const x = i * (barW + BAR_GAP)
          const fillRatio = cap > 0 ? p.predictedFree / cap : 0
          const barH = Math.max(3, fillRatio * CHART_H)
          const y = CHART_H - barH
          const color = getColor(p.predictedFree)
          const isBest = best !== null && p.hour === best.hour && p.label === best.label
          const alpha = p.confidence < 0.5 ? 0.5 : p.confidence < 0.7 ? 0.72 : 1

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                fill={color}
                opacity={alpha}
                rx={2}
              />
              {isBest && (
                <polygon
                  points={`${x + barW / 2 - 4},${y - 6} ${x + barW / 2 + 4},${y - 6} ${x + barW / 2},${y - 1}`}
                  fill="#007079"
                />
              )}
              <text
                x={x + barW / 2}
                y={CHART_H + 12}
                textAnchor="middle"
                fontSize={9}
                fill={isBest ? '#007079' : '#888'}
                fontWeight={isBest ? 700 : 400}
                fontFamily="Equinor, sans-serif"
              >
                {p.label === 'now' ? t('prediction.now') : p.label}
              </text>
            </g>
          )
        })}
      </svg>

      {best && (
        <div style={{ fontSize: '11px', color: '#3d3d3d', marginTop: '2px' }}>
          <span style={{ color: '#007079', fontWeight: 700 }}>▲ </span>
          {t('prediction.best', {
            time: best.label === 'now' ? t('prediction.now') : best.label,
            count: best.predictedFree,
          })}
        </div>
      )}
    </div>
  )
}
