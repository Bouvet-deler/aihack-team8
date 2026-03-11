import type { ParkingSpot } from '../types/parking'
import type { BikeStation } from '../types/bike'
import { getColor } from './ParkingMarker'
import { getBikeColor } from './BikeMarker'

interface SidebarProps {
  // parking
  spots: ParkingSpot[]
  selectedSpot: ParkingSpot | null
  onSelectSpot: (spot: ParkingSpot) => void
  parkingLastUpdated: Date | null
  parkingLoading: boolean
  onRefreshParking: () => void
  // bikes
  bikeStations: BikeStation[]
  selectedStation: BikeStation | null
  onSelectStation: (station: BikeStation) => void
  bikeLastUpdated: Date | null
  bikeLoading: boolean
  onRefreshBikes: () => void
  // shared
  refreshInterval: number
  onIntervalChange: (ms: number) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  activeTab: 'parking' | 'bikes'
  onTabChange: (tab: 'parking' | 'bikes') => void
  showParking: boolean
  onToggleParking: () => void
  showBikes: boolean
  onToggleBikes: () => void
}

const INTERVAL_OPTIONS = [
  { label: '30 sek', value: 30_000 },
  { label: '1 min', value: 60_000 },
  { label: '2 min', value: 120_000 },
  { label: '5 min', value: 300_000 },
]

function formatTime(date: Date): string {
  return date.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function Sidebar({
  spots, selectedSpot, onSelectSpot, parkingLastUpdated, parkingLoading, onRefreshParking,
  bikeStations, selectedStation, onSelectStation, bikeLastUpdated, bikeLoading, onRefreshBikes,
  refreshInterval, onIntervalChange,
  searchQuery, onSearchChange,
  activeTab, onTabChange,
  showParking, onToggleParking,
  showBikes, onToggleBikes,
}: SidebarProps) {
  const isParking = activeTab === 'parking'
  const loading = isParking ? parkingLoading : bikeLoading
  const lastUpdated = isParking ? parkingLastUpdated : bikeLastUpdated
  const onRefresh = isParking ? onRefreshParking : onRefreshBikes

  const filteredSpots = spots
    .filter((s) => s.Sted.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.Antall_ledige_plasser - a.Antall_ledige_plasser)

  const filteredStations = bikeStations
    .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.num_vehicles_available - a.num_vehicles_available)

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007079" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8M12 8v8" />
          </svg>
          <span>Stavanger mobilitet</span>
        </div>

        {/* Layer toggles */}
        <div className="layer-toggles">
          <button
            className={`layer-toggle ${showParking ? 'active' : ''}`}
            onClick={onToggleParking}
            title="Vis/skjul parkering"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>
            </svg>
            Parkering
          </button>
          <button
            className={`layer-toggle ${showBikes ? 'active' : ''}`}
            onClick={onToggleBikes}
            title="Vis/skjul bysykler"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="5.5" cy="17.5" r="3.5"/>
              <circle cx="18.5" cy="17.5" r="3.5"/>
              <path d="M15 6a1 1 0 0 0-1 1v5.5H9L5.5 17.5"/>
              <path d="m8 6 1.5 5.5M15 6H8"/>
            </svg>
            Bysykkel
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${isParking ? 'active' : ''}`}
            onClick={() => { onTabChange('parking'); onSearchChange('') }}
          >
            Parkering
            <span className="tab-badge">{spots.length}</span>
          </button>
          <button
            className={`tab ${!isParking ? 'active' : ''}`}
            onClick={() => { onTabChange('bikes'); onSearchChange('') }}
          >
            Bysykkel
            <span className="tab-badge">{bikeStations.length}</span>
          </button>
        </div>

        {/* Search */}
        <div className="search-wrapper">
          <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            className="search-input"
            placeholder={isParking ? 'Søk etter parkeringsplass…' : 'Søk etter sykkelpunkt…'}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Søk"
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => onSearchChange('')} aria-label="Tøm søk">×</button>
          )}
        </div>

        {/* Controls */}
        <div className="sidebar-controls">
          <div className="control-group">
            <label htmlFor="interval-select" className="control-label">Oppdater</label>
            <select
              id="interval-select"
              className="interval-select"
              value={refreshInterval}
              onChange={(e) => onIntervalChange(Number(e.target.value))}
            >
              {INTERVAL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <button
            className={`refresh-btn ${loading ? 'loading' : ''}`}
            onClick={onRefresh}
            disabled={loading}
            title="Oppdater nå"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={loading ? 'spin' : ''}>
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        </div>

        {lastUpdated && (
          <div className="last-updated">Sist oppdatert: {formatTime(lastUpdated)}</div>
        )}
      </div>

      {/* List */}
      <div className="spot-list">
        {isParking ? (
          <>
            {filteredSpots.length === 0 && !loading && (
              <div className="empty-state">
                {searchQuery ? `Ingen treff på "${searchQuery}"` : 'Ingen parkeringsdata tilgjengelig'}
              </div>
            )}
            {filteredSpots.map((spot) => {
              const isSelected = selectedSpot?.Sted === spot.Sted
              const color = getColor(spot.Antall_ledige_plasser)
              return (
                <button
                  key={spot.Sted}
                  className={`spot-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectSpot(spot)}
                >
                  <span className="spot-indicator" style={{ background: color }} aria-hidden="true" />
                  <span className="spot-name">{spot.Sted}</span>
                  <span className="spot-count" style={{ color }}>{spot.Antall_ledige_plasser}</span>
                </button>
              )
            })}
          </>
        ) : (
          <>
            {filteredStations.length === 0 && !loading && (
              <div className="empty-state">
                {searchQuery ? `Ingen treff på "${searchQuery}"` : 'Ingen sykkeldata tilgjengelig'}
              </div>
            )}
            {filteredStations.map((station) => {
              const isSelected = selectedStation?.station_id === station.station_id
              const color = getBikeColor(station)
              return (
                <button
                  key={station.station_id}
                  className={`spot-item ${isSelected ? 'selected' : ''} ${!station.is_renting ? 'inactive' : ''}`}
                  onClick={() => onSelectStation(station)}
                >
                  <span className="spot-indicator bike-indicator" style={{ background: color }} aria-hidden="true" />
                  <span className="spot-name">{station.name}</span>
                  <div className="bike-counts">
                    <span className="spot-count" style={{ color }} title="Ledige sykler">
                      {station.num_vehicles_available}
                    </span>
                  </div>
                </button>
              )
            })}
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <span>Data: </span>
        <a href="https://opencom.no" target="_blank" rel="noopener noreferrer">opencom.no</a>
      </div>
    </aside>
  )
}
