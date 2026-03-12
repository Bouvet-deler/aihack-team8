import { divIcon } from 'leaflet'
import { Marker, Popup } from 'react-leaflet'
import { useTranslation } from 'react-i18next'
import type { Scooter } from '../types/scooter'

export function getScooterColor(scooter: Scooter): string {
  if (scooter.is_disabled) return '#9ca3af'
  if (scooter.battery_pct < 10) return '#ef4444'
  if (scooter.battery_pct < 25) return '#f97316'
  if (scooter.battery_pct <= 50) return '#eab308'
  return '#22c55e'
}

// E-scooter SVG icon (kick scooter silhouette)
const SCOOTER_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="7.5" cy="19.5" r="2.5"/>
  <circle cx="18" cy="19.5" r="2.5"/>
  <path d="M18 19.5V6l-4 0"/>
  <path d="M7.5 19.5l3-12h4"/>
</svg>`

interface ScooterMarkerProps {
  scooter: Scooter
  isSelected: boolean
  dimmed: boolean
  isFavorite: boolean
  onClick: () => void
  onToggleFavorite: () => void
}

export function ScooterMarker({ scooter, isSelected, dimmed, isFavorite, onClick, onToggleFavorite }: ScooterMarkerProps) {
  const { t } = useTranslation()
  const color = getScooterColor(scooter)
  const textColor = scooter.battery_pct <= 50 && !scooter.is_disabled ? '#1a1a1a' : '#ffffff'
  const size = isSelected ? 46 : dimmed ? 28 : 36
  const border = isFavorite
    ? '2.5px solid #f59e0b'
    : isSelected
    ? '3px solid #007079'
    : '2px solid rgba(0,0,0,0.3)'
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
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0px;
        font-family: Equinor, sans-serif;
        font-weight: 700;
        color: ${textColor};
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        opacity: ${opacity};
        transition: all 0.15s ease;
        position: relative;
        pointer-events: none;
        transform: rotate(45deg);
      ">
        <div style="transform: rotate(-45deg); display:flex; flex-direction:column; align-items:center; gap:0px;">
          <div style="display:flex; color:${textColor}; line-height:1">${SCOOTER_ICON}</div>
          <div style="font-size: 8px; line-height:1">${scooter.battery_pct}%</div>
        </div>
        ${isFavorite ? `<span style="position:absolute;top:-6px;right:-6px;font-size:10px;line-height:1;transform:rotate(-45deg)">★</span>` : ''}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })

  const rangeKm = (scooter.range_meters / 1000).toFixed(1)

  return (
    <Marker position={[scooter.lat, scooter.lon]} icon={icon} eventHandlers={{ click: onClick }}>
      <Popup>
        <div style={{ fontFamily: 'Equinor, sans-serif', minWidth: '160px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#3d3d3d' }}>
              {scooter.operator}
            </div>
            <button
              onClick={onToggleFavorite}
              title={isFavorite ? t('favorites.remove') : t('favorites.add')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                lineHeight: 1,
                color: isFavorite ? '#f59e0b' : '#c0c0c0',
                padding: '2px',
              }}
            >
              {isFavorite ? '★' : '☆'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '6px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#6f6f6f' }}>{t('scooter.battery')}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color }}>{scooter.battery_pct}%</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6f6f6f' }}>{t('scooter.range')}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#3d3d3d' }}>{rangeKm} km</div>
            </div>
          </div>

          {scooter.is_disabled && (
            <div style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic', marginBottom: '4px' }}>
              {t('scooter.disabled')}
            </div>
          )}

          <div style={{ fontSize: '11px', color: '#6f6f6f' }}>
            ID: {scooter.vehicle_id.split(':').pop()}
          </div>
        </div>
      </Popup>
    </Marker>
  )
}
