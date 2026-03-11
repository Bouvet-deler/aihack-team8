import { divIcon } from 'leaflet'
import { Marker, Popup } from 'react-leaflet'
import type { BikeStation } from '../types/bike'

export function getBikeColor(station: BikeStation): string {
  if (!station.is_renting) return '#9ca3af'
  if (station.num_vehicles_available === 0) return '#ef4444'
  if (station.num_vehicles_available <= 2) return '#f97316'
  if (station.num_vehicles_available <= 5) return '#eab308'
  return '#22c55e'
}

function getTextColor(station: BikeStation): string {
  if (!station.is_renting) return '#ffffff'
  return station.num_vehicles_available <= 5 ? '#1a1a1a' : '#ffffff'
}

function formatLastReported(iso: string): string {
  try {
    return new Date(iso).toLocaleString('no-NO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

// Bicycle SVG path encoded as inline HTML for divIcon
const BIKE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="5.5" cy="17.5" r="3.5"/>
  <circle cx="18.5" cy="17.5" r="3.5"/>
  <path d="M15 6a1 1 0 0 0-1 1v5.5H9L5.5 17.5"/>
  <path d="m8 6 1.5 5.5M15 6H8"/>
</svg>`

interface BikeMarkerProps {
  station: BikeStation
  isSelected: boolean
  dimmed: boolean
  onClick: () => void
}

export function BikeMarker({ station, isSelected, dimmed, onClick }: BikeMarkerProps) {
  const color = getBikeColor(station)
  const textColor = getTextColor(station)
  const size = isSelected ? 52 : dimmed ? 34 : 44
  const border = isSelected ? '3px solid #007079' : '2px solid rgba(0,0,0,0.3)'
  const opacity = dimmed ? 0.25 : 1
  const count = Number.isFinite(station.num_vehicles_available) ? station.num_vehicles_available : '?'

  const icon = divIcon({
    className: '',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 8px;
        border: ${border};
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1px;
        font-family: Equinor, sans-serif;
        font-weight: 700;
        color: ${textColor};
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        opacity: ${opacity};
        transition: all 0.15s ease;
      ">
        <div style="display:flex; color:${textColor}; line-height:1">${BIKE_ICON}</div>
        <div style="font-size: 10px; line-height:1">${count}</div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })

  return (
    <Marker position={[station.lat, station.lon]} icon={icon} eventHandlers={{ click: onClick }}>
      <Popup>
        <div style={{ fontFamily: 'Equinor, sans-serif', minWidth: '180px' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '6px', color: '#3d3d3d' }}>
            {station.name}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '6px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#6f6f6f' }}>Ledige sykler</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color }}>{station.num_vehicles_available}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6f6f6f' }}>Ledige låser</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#3d3d3d' }}>{station.num_docks_available}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6f6f6f' }}>Kapasitet</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#3d3d3d' }}>{station.capacity}</div>
            </div>
          </div>

          {!station.is_renting && (
            <div style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic', marginBottom: '4px' }}>
              Stasjonen er ikke aktiv
            </div>
          )}

          <div style={{ fontSize: '11px', color: '#6f6f6f' }}>
            Oppdatert: {formatLastReported(station.last_reported)}
          </div>
        </div>
      </Popup>
    </Marker>
  )
}
