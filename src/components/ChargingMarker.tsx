import { divIcon } from 'leaflet'
import { Marker, Popup } from 'react-leaflet'
import { useTranslation } from 'react-i18next'
import type { ChargingStation } from '../types/charging'

export function getChargingColor(station: ChargingStation): string {
  if (station.availablePoints === 0) return '#ef4444'
  if (station.availablePoints <= 2) return '#f97316'
  if (station.availablePoints <= 5) return '#eab308'
  return '#22c55e'
}

// Lightning bolt SVG
const BOLT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
</svg>`

interface ChargingMarkerProps {
  station: ChargingStation
  isSelected: boolean
  dimmed: boolean
  isFavorite: boolean
  onClick: () => void
  onToggleFavorite: () => void
}

export function ChargingMarker({ station, isSelected, dimmed, isFavorite, onClick, onToggleFavorite }: ChargingMarkerProps) {
  const { t } = useTranslation()
  const color = getChargingColor(station)
  const textColor = station.availablePoints <= 5 && station.availablePoints > 0 ? '#1a1a1a' : '#ffffff'
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
        border-radius: 50% 50% 50% 4px;
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
      ">
        <div style="display:flex; color:${textColor}; line-height:1">${BOLT_ICON}</div>
        <div style="font-size: 8px; line-height:1">${station.availablePoints}/${station.numPoints}</div>
        ${isFavorite ? `<span style="position:absolute;top:-6px;right:-6px;font-size:10px;line-height:1">★</span>` : ''}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  })

  return (
    <Marker position={[station.lat, station.lon]} icon={icon} eventHandlers={{ click: onClick }}>
      <Popup>
        <div style={{ fontFamily: 'Equinor, sans-serif', minWidth: '180px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#3d3d3d' }}>
              {station.name}
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

          <div style={{ fontSize: '12px', color: '#6f6f6f', marginBottom: '8px' }}>
            {station.address}, {station.city}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#6f6f6f' }}>{t('charging.available')}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color }}>
                {station.availablePoints}/{station.numPoints}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6f6f6f' }}>{t('charging.power')}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#3d3d3d' }}>{station.maxCapacity}</div>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#6f6f6f', marginBottom: '4px' }}>
            {t('charging.connectors')}: {station.connectors.join(', ')}
          </div>

          <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#6f6f6f' }}>
            {station.open24h && <span>24h</span>}
            {station.isPublic && <span>{t('charging.public')}</span>}
            <span>{station.owner}</span>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}
