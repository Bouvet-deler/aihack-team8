import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'
import type { ParkingSpot } from '../types/parking'
import type { BikeStation } from '../types/bike'
import type { TransitStop } from '../types/transit'
import type { CityConfig } from '../config/cities'
import { getColor } from './ParkingMarker'
import { getBikeColor } from './BikeMarker'
import { getTransitColor } from './TransitMarker'
import { haversineMetres, formatDistance, formatWalkingTime } from '../utils/distance'
import { useDevCosts } from '../hooks/useDevCosts'

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
  // transit
  transitStops: TransitStop[]
  selectedTransitStop: TransitStop | null
  onSelectTransitStop: (stop: TransitStop) => void
  transitLoading: boolean
  transitLastUpdated: Date | null
  onRefreshTransit: () => void
  // shared
  refreshInterval: number
  onIntervalChange: (ms: number) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  activeTab: 'parking' | 'bikes' | 'transit'
  onTabChange: (tab: 'parking' | 'bikes' | 'transit') => void
  showParking: boolean
  onToggleParking: () => void
  showBikes: boolean
  onToggleBikes: () => void
  showTransit: boolean
  onToggleTransit: () => void
  width: number | undefined
  onResizeHandleMouseDown: (e: React.MouseEvent) => void
  userPosition: GeolocationCoordinates | null
  onRequestLocation: () => void
  isDark: boolean
  onToggleDark: () => void
  favorites: { parking: string[], bikes: string[] }
  isFavorite: (type: 'parking' | 'bikes', id: string) => boolean
  onToggleFavorite: (type: 'parking' | 'bikes', id: string) => void
  city: CityConfig
  cities: CityConfig[]
  onSelectCity: (city: CityConfig) => void
}

const INTERVAL_OPTIONS = [
  { label: '30 sek', value: 30_000 },
  { label: '1 min', value: 60_000 },
  { label: '2 min', value: 120_000 },
  { label: '5 min', value: 300_000 },
]

const LANGUAGES = ['no', 'en', 'es'] as const

function formatTime(date: Date): string {
  return date.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function Sidebar({
  spots, selectedSpot, onSelectSpot, parkingLastUpdated, parkingLoading, onRefreshParking,
  bikeStations, selectedStation, onSelectStation, bikeLastUpdated, bikeLoading, onRefreshBikes,
  transitStops, selectedTransitStop, onSelectTransitStop, transitLoading, transitLastUpdated, onRefreshTransit,
  refreshInterval, onIntervalChange,
  searchQuery, onSearchChange,
  activeTab, onTabChange,
  showParking, onToggleParking,
  showBikes, onToggleBikes,
  showTransit, onToggleTransit,
  width, onResizeHandleMouseDown,
  userPosition,
  onRequestLocation,
  isDark, onToggleDark,
  favorites, isFavorite, onToggleFavorite,
  city, cities, onSelectCity,
}: SidebarProps) {
  const { t, i18n: i18nInstance } = useTranslation()
  const [sortByNearest, setSortByNearest] = useState(false)
  const devCosts = useDevCosts()

  const isParking = activeTab === 'parking'
  const isBikes = activeTab === 'bikes'
  const isTransit = activeTab === 'transit'
  const loading = isParking ? parkingLoading : isBikes ? bikeLoading : transitLoading
  const lastUpdated = isParking ? parkingLastUpdated : isBikes ? bikeLastUpdated : transitLastUpdated
  const onRefresh = isParking ? onRefreshParking : isBikes ? onRefreshBikes : onRefreshTransit

  const canSortNearest = sortByNearest && userPosition !== null

  const filteredSpots = spots
    .filter((s) => s.Sted.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (canSortNearest) {
        const distA = haversineMetres(
          userPosition!.latitude, userPosition!.longitude,
          parseFloat(a.Latitude), parseFloat(a.Longitude),
        )
        const distB = haversineMetres(
          userPosition!.latitude, userPosition!.longitude,
          parseFloat(b.Latitude), parseFloat(b.Longitude),
        )
        return distA - distB
      }
      return b.Antall_ledige_plasser - a.Antall_ledige_plasser
    })

  const filteredStations = bikeStations
    .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (canSortNearest) {
        const distA = haversineMetres(
          userPosition!.latitude, userPosition!.longitude,
          a.lat, a.lon,
        )
        const distB = haversineMetres(
          userPosition!.latitude, userPosition!.longitude,
          b.lat, b.lon,
        )
        return distA - distB
      }
      return b.num_vehicles_available - a.num_vehicles_available
    })

  const filteredTransit = transitStops
    .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (canSortNearest && userPosition) {
        const distA = haversineMetres(userPosition.latitude, userPosition.longitude, a.latitude, a.longitude)
        const distB = haversineMetres(userPosition.latitude, userPosition.longitude, b.latitude, b.longitude)
        return distA - distB
      }
      return 0
    })

  return (
    <aside className="sidebar" style={width !== undefined ? { width } : undefined}>
      <div className="sidebar-header">
        <div className="sidebar-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007079" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8M12 8v8" />
          </svg>
          <span>{t('header.title')}</span>

          {/* Dark mode toggle */}
          <button
            className="theme-toggle"
            onClick={onToggleDark}
            aria-label={isDark ? t('theme.toggleLight') : t('theme.toggleDark')}
            title={isDark ? t('theme.toggleLight') : t('theme.toggleDark')}
          >
            {isDark ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* Language switcher */}
          <div className="lang-switcher">
            {LANGUAGES.map((lng) => (
              <button
                key={lng}
                className={`lang-btn ${i18nInstance.language === lng ? 'active' : ''}`}
                onClick={() => i18n.changeLanguage(lng)}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>

          {/* City selector */}
          <select
            className="city-select"
            value={city.id}
            onChange={(e) => {
              const selected = cities.find((c) => c.id === e.target.value)
              if (selected) onSelectCity(selected)
            }}
            aria-label={t('city.select')}
            title={t('city.select')}
          >
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Layer toggles */}
        <div className="layer-toggles">
          {city.parking && (
          <button
            className={`layer-toggle ${showParking ? 'active' : ''}`}
            onClick={onToggleParking}
            title={t('parking.toggle')}
            aria-label={t('parking.toggle')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>
            </svg>
            {t('parking.label')}
          </button>
          )}
          <button
            className={`layer-toggle ${showBikes ? 'active' : ''}`}
            onClick={onToggleBikes}
            title={t('bikes.toggle')}
            aria-label={t('bikes.toggle')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="5.5" cy="17.5" r="3.5"/>
              <circle cx="18.5" cy="17.5" r="3.5"/>
              <path d="M15 6a1 1 0 0 0-1 1v5.5H9L5.5 17.5"/>
              <path d="m8 6 1.5 5.5M15 6H8"/>
            </svg>
            {t('bikes.label')}
          </button>
          <button
            className={`layer-toggle ${showTransit ? 'active' : ''}`}
            onClick={onToggleTransit}
            title={t('transit.toggle')}
            aria-label={t('transit.toggle')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="13" rx="2"/>
              <path d="M8 19h8M12 16v3"/>
            </svg>
            {t('transit.label')}
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {city.parking && (
          <button
            className={`tab ${isParking ? 'active' : ''}`}
            onClick={() => { onTabChange('parking'); onSearchChange('') }}
          >
            {t('tab.parking')}
            <span className="tab-badge">{spots.length}</span>
            {favorites.parking.length > 0 && (
              <span className="tab-fav-badge">★{favorites.parking.length}</span>
            )}
          </button>
          )}
          <button
            className={`tab ${isBikes ? 'active' : ''}`}
            onClick={() => { onTabChange('bikes'); onSearchChange('') }}
          >
            {t('tab.bikes')}
            <span className="tab-badge">{bikeStations.length}</span>
            {favorites.bikes.length > 0 && (
              <span className="tab-fav-badge">★{favorites.bikes.length}</span>
            )}
          </button>
          <button
            className={`tab ${isTransit ? 'active' : ''}`}
            onClick={() => { onTabChange('transit'); onSearchChange('') }}
          >
            {t('tab.transit')}
            <span className="tab-badge">{transitStops.length}</span>
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
            placeholder={isParking ? t('search.parking') : isTransit ? t('search.transit') : t('search.bikes')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label={t('search.label')}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => onSearchChange('')} aria-label={t('search.clear')}>×</button>
          )}
        </div>

        {/* Controls */}
        <div className="sidebar-controls">
          <div className="control-group">
            <label htmlFor="interval-select" className="control-label">{t('refresh.label')}</label>
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
            title={t('refresh.now')}
            aria-label={t('refresh.now')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={loading ? 'spin' : ''}>
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        </div>

        {/* Location: sort button when available, enable-hint when not */}
        {userPosition ? (
          <button
            className={`nearest-btn ${sortByNearest ? 'active' : ''}`}
            onClick={() => setSortByNearest((v) => !v)}
            title={t('sort.nearest')}
            aria-label={t('sort.nearest')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            {sortByNearest ? t('sort.default') : t('sort.nearest')}
          </button>
        ) : (
          <button className="enable-location-btn" onClick={onRequestLocation}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            {t('geo.enable')}
          </button>
        )}

        {lastUpdated && (
          <div className="last-updated">{t('lastUpdated')} {formatTime(lastUpdated)}</div>
        )}
      </div>

      {/* List */}
      <div className="spot-list">
        {isTransit ? (
          <>
            {filteredTransit.length === 0 && !loading && (
              <div className="empty-state">
                {searchQuery
                  ? t('empty.transitSearch', { query: searchQuery })
                  : t('empty.transit')}
              </div>
            )}
            {filteredTransit.map((stop) => {
              const isSelected = selectedTransitStop?.id === stop.id
              const color = getTransitColor(stop.transportMode)
              const dist = userPosition
                ? haversineMetres(userPosition.latitude, userPosition.longitude, stop.latitude, stop.longitude)
                : null
              const modeLabel = stop.transportMode.map((m) => t(`transit.mode.${m}`, m)).join(', ')
              return (
                <div key={stop.id} className={`spot-item ${isSelected ? 'selected' : ''}`}>
                  <button className="spot-item-main transit-item-main" onClick={() => onSelectTransitStop(stop)}>
                    <span
                      className="transit-mode-badge"
                      style={{ background: color }}
                    >{modeLabel}</span>
                    <span className="spot-name">
                      {stop.name}
                      {dist !== null && (
                        <span className="spot-walk-row">
                          {formatDistance(dist)} · {formatWalkingTime(dist)}
                        </span>
                      )}
                    </span>
                  </button>
                </div>
              )
            })}
          </>
        ) : isParking ? (
          <>
            {/* Favorited parking spots pinned at top */}
            {favorites.parking.length > 0 && !searchQuery && (
              <>
                <div className="list-section-label">{t('favorites.label')}</div>
                {spots
                  .filter((s) => isFavorite('parking', s.Sted))
                  .map((spot) => {
                    const isSelected = selectedSpot?.Sted === spot.Sted
                    const color = getColor(spot.Antall_ledige_plasser)
                    const dist = userPosition
                      ? haversineMetres(userPosition.latitude, userPosition.longitude, parseFloat(spot.Latitude), parseFloat(spot.Longitude))
                      : null
                    return (
                      <div key={`fav-${spot.Sted}`} className={`spot-item ${isSelected ? 'selected' : ''}`}>
                        <button className="spot-item-main" onClick={() => onSelectSpot(spot)}>
                          <span className="spot-indicator" style={{ background: color }} aria-hidden="true" />
                          <span className="spot-name">
                            {spot.Sted}
                            {dist !== null && (
                              <span className="spot-walk-row">{formatDistance(dist)} · {formatWalkingTime(dist)}</span>
                            )}
                          </span>
                          <span className="spot-count" style={{ color }}>{spot.Antall_ledige_plasser}</span>
                        </button>
                        <button
                          className="fav-btn active"
                          onClick={() => onToggleFavorite('parking', spot.Sted)}
                          aria-label={t('favorites.remove')}
                        >★</button>
                      </div>
                    )
                  })}
                <div className="list-divider" />
              </>
            )}

            {filteredSpots.length === 0 && !loading && (
              <div className="empty-state">
                {searchQuery
                  ? t('empty.parkingSearch', { query: searchQuery })
                  : t('empty.parking')}
              </div>
            )}
            {filteredSpots.map((spot) => {
              const isSelected = selectedSpot?.Sted === spot.Sted
              const color = getColor(spot.Antall_ledige_plasser)
              const fav = isFavorite('parking', spot.Sted)
              const dist = userPosition
                ? haversineMetres(
                    userPosition.latitude, userPosition.longitude,
                    parseFloat(spot.Latitude), parseFloat(spot.Longitude),
                  )
                : null
              return (
                <div key={spot.Sted} className={`spot-item ${isSelected ? 'selected' : ''}`}>
                  <button className="spot-item-main" onClick={() => onSelectSpot(spot)}>
                    <span className="spot-indicator" style={{ background: color }} aria-hidden="true" />
                    <span className="spot-name">
                      {spot.Sted}
                      {dist !== null && (
                        <span className="spot-walk-row">
                          {formatDistance(dist)} · {formatWalkingTime(dist)}
                        </span>
                      )}
                    </span>
                    <span className="spot-count" style={{ color }}>{spot.Antall_ledige_plasser}</span>
                  </button>
                  <button
                    className={`fav-btn ${fav ? 'active' : ''}`}
                    onClick={() => onToggleFavorite('parking', spot.Sted)}
                    aria-label={fav ? t('favorites.remove') : t('favorites.add')}
                  >{fav ? '★' : '☆'}</button>
                </div>
              )
            })}
          </>
        ) : (
          <>
            {/* Favorited bike stations pinned at top */}
            {favorites.bikes.length > 0 && !searchQuery && (
              <>
                <div className="list-section-label">{t('favorites.label')}</div>
                {bikeStations
                  .filter((s) => isFavorite('bikes', s.station_id))
                  .map((station) => {
                    const isSelected = selectedStation?.station_id === station.station_id
                    const color = getBikeColor(station)
                    const dist = userPosition
                      ? haversineMetres(userPosition.latitude, userPosition.longitude, station.lat, station.lon)
                      : null
                    return (
                      <div key={`fav-${station.station_id}`} className={`spot-item ${isSelected ? 'selected' : ''} ${!station.is_renting ? 'inactive' : ''}`}>
                        <button className="spot-item-main" onClick={() => onSelectStation(station)}>
                          <span className="spot-indicator bike-indicator" style={{ background: color }} aria-hidden="true" />
                          <span className="spot-name">
                            {station.name}
                            {dist !== null && (
                              <span className="spot-walk-row">{formatDistance(dist)} · {formatWalkingTime(dist)}</span>
                            )}
                          </span>
                          <span className="spot-count" style={{ color }}>{station.num_vehicles_available}</span>
                        </button>
                        <button
                          className="fav-btn active"
                          onClick={() => onToggleFavorite('bikes', station.station_id)}
                          aria-label={t('favorites.remove')}
                        >★</button>
                      </div>
                    )
                  })}
                <div className="list-divider" />
              </>
            )}

            {filteredStations.length === 0 && !loading && (
              <div className="empty-state">
                {searchQuery
                  ? t('empty.bikesSearch', { query: searchQuery })
                  : t('empty.bikes')}
              </div>
            )}
            {filteredStations.map((station) => {
              const isSelected = selectedStation?.station_id === station.station_id
              const color = getBikeColor(station)
              const fav = isFavorite('bikes', station.station_id)
              const dist = userPosition
                ? haversineMetres(
                    userPosition.latitude, userPosition.longitude,
                    station.lat, station.lon,
                  )
                : null
              return (
                <div key={station.station_id} className={`spot-item ${isSelected ? 'selected' : ''} ${!station.is_renting ? 'inactive' : ''}`}>
                  <button className="spot-item-main" onClick={() => onSelectStation(station)}>
                    <span className="spot-indicator bike-indicator" style={{ background: color }} aria-hidden="true" />
                    <span className="spot-name">
                      {station.name}
                      {dist !== null && (
                        <span className="spot-walk-row">
                          {formatDistance(dist)} · {formatWalkingTime(dist)}
                        </span>
                      )}
                    </span>
                    <div className="bike-counts">
                      <span className="spot-count" style={{ color }} title={t('bike.available')}>{station.num_vehicles_available}</span>
                    </div>
                  </button>
                  <button
                    className={`fav-btn ${fav ? 'active' : ''}`}
                    onClick={() => onToggleFavorite('bikes', station.station_id)}
                    aria-label={fav ? t('favorites.remove') : t('favorites.add')}
                  >{fav ? '★' : '☆'}</button>
                </div>
              )
            })}
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <span className="build-version">v{__BUILD_VERSION__}</span>
        <span>{t('data.label')} </span>
        <a href="https://opencom.no" target="_blank" rel="noopener noreferrer">opencom.no</a>
        {devCosts && (
          <span className="dev-cost-label" title={`${devCosts.sessionCount} AI sessions`}>
            AI dev: ~{Math.round(devCosts.totalNOK)} kr
          </span>
        )}
      </div>

      <div
        className="sidebar-resize-handle"
        onMouseDown={onResizeHandleMouseDown}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
      />
    </aside>
  )
}
