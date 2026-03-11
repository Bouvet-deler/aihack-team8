import { divIcon } from 'leaflet'
import { Marker, Popup } from 'react-leaflet'
import { useTranslation } from 'react-i18next'
import type { ParkingSpot } from '../types/parking'
import { PredictionChart } from './PredictionChart'

export function getColor(freeSpots: number): string {
  if (freeSpots > 100) return '#22c55e'
  if (freeSpots > 50) return '#eab308'
  if (freeSpots > 20) return '#f97316'
  return '#ef4444'
}

function getTextColor(freeSpots: number): string {
  return freeSpots > 50 ? '#1a1a1a' : '#ffffff'
}

interface ParkingMarkerProps {
  spot: ParkingSpot
  isSelected: boolean
  dimmed: boolean
  isFavorite: boolean
  onClick: () => void
  onToggleFavorite: () => void
}

export function ParkingMarker({ spot, isSelected, dimmed, isFavorite, onClick, onToggleFavorite }: ParkingMarkerProps) {
  const { t } = useTranslation()
  const lat = parseFloat(spot.Latitude)
  const lng = parseFloat(spot.Longitude)

  if (isNaN(lat) || isNaN(lng)) return null

  const color = getColor(spot.Antall_ledige_plasser)
  const textColor = getTextColor(spot.Antall_ledige_plasser)
  const size = isSelected ? 48 : dimmed ? 32 : 40
  const border = isFavorite
    ? '2.5px solid #f59e0b'
    : isSelected
    ? '3px solid #007079'
    : '2px solid rgba(0,0,0,0.3)'
  const opacity = dimmed ? 0.25 : 1

  // Sanitize: coerce to number so a malicious API value can never inject HTML
  const safeCount = Number(spot.Antall_ledige_plasser)
  const displayCount = Number.isFinite(safeCount) ? safeCount : '?'

  const icon = divIcon({
    className: '',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        border: ${border};
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Equinor, sans-serif;
        font-size: ${isSelected ? '13px' : '12px'};
        font-weight: 700;
        color: ${textColor};
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        opacity: ${opacity};
        transition: all 0.15s ease;
        position: relative;
        pointer-events: none;
      ">
        ${displayCount}
        ${isFavorite ? `<span style="position:absolute;top:-4px;right:-4px;font-size:10px;line-height:1">★</span>` : ''}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })

  return (
    <Marker position={[lat, lng]} icon={icon} eventHandlers={{ click: onClick }}>
      <Popup>
        <div style={{ fontFamily: 'Equinor, sans-serif', minWidth: '160px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#3d3d3d' }}>
              {spot.Sted}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '16px', fontWeight: 700, color }}>
              {spot.Antall_ledige_plasser}
            </span>
            <span style={{ fontSize: '13px', color: '#565656' }}>{t('parking.spots')}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#6f6f6f', marginTop: '6px' }}>
            {spot.Dato} kl. {spot.Klokkeslett}
          </div>
          <PredictionChart currentFree={spot.Antall_ledige_plasser} />
        </div>
      </Popup>
    </Marker>
  )
}
