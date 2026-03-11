import { divIcon } from 'leaflet'
import { Marker, Popup } from 'react-leaflet'
import { useTranslation } from 'react-i18next'
import type { TransitStop } from '../types/transit'

export function getTransitColor(modes: string[]): string {
  if (modes.includes('water')) return '#06b6d4'
  if (modes.includes('rail')) return '#8b5cf6'
  if (modes.includes('metro')) return '#ec4899'
  if (modes.includes('tram')) return '#f59e0b'
  return '#3b82f6' // bus default
}

function getModeEmoji(modes: string[]): string {
  if (modes.includes('water')) return '⛴'
  if (modes.includes('rail')) return '🚂'
  if (modes.includes('metro')) return '🚇'
  if (modes.includes('tram')) return '🚊'
  return '🚌'
}

interface TransitMarkerProps {
  stop: TransitStop
  isSelected: boolean
  dimmed: boolean
  onClick: () => void
}

export function TransitMarker({ stop, isSelected, dimmed, onClick }: TransitMarkerProps) {
  const { t } = useTranslation()
  const color = getTransitColor(stop.transportMode)
  const emoji = getModeEmoji(stop.transportMode)
  const size = isSelected ? 44 : dimmed ? 28 : 36
  const border = isSelected ? '3px solid #007079' : '2px solid rgba(0,0,0,0.3)'
  const opacity = dimmed ? 0.25 : 1

  const icon = divIcon({
    className: '',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 6px;
        border: ${border};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${isSelected ? '16px' : '14px'};
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        opacity: ${opacity};
        transition: all 0.15s ease;
      ">${emoji}</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })

  const modeLabels = stop.transportMode.map((m) => t(`transit.mode.${m}`, m)).join(', ')

  return (
    <Marker
      position={[stop.latitude, stop.longitude]}
      icon={icon}
      eventHandlers={{ click: onClick }}
    >
      <Popup autoPan={false}>
        <div style={{ fontFamily: 'Equinor, sans-serif', minWidth: '160px' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '6px', color: '#3d3d3d' }}>
            {stop.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              background: color,
              color: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
            }}>
              {emoji} {modeLabels}
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}
