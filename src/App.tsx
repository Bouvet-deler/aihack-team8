import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Map } from './components/Map'
import { Sidebar } from './components/Sidebar'
import { useParking } from './hooks/useParking'
import { useBikes } from './hooks/useBikes'
import { useGeolocation } from './hooks/useGeolocation'
import { useSidebarResize } from './hooks/useSidebarResize'
import { useDarkMode } from './hooks/useDarkMode'
import { useFavorites } from './hooks/useFavorites'
import type { ParkingSpot } from './types/parking'
import type { BikeStation } from './types/bike'
import './App.css'

const DEFAULT_INTERVAL = 60_000

export default function App() {
  const { t } = useTranslation()
  const [refreshInterval, setRefreshInterval] = useState(DEFAULT_INTERVAL)
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null)
  const [selectedStation, setSelectedStation] = useState<BikeStation | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'parking' | 'bikes'>('parking')
  const [showParking, setShowParking] = useState(true)
  const [showBikes, setShowBikes] = useState(true)
  const [reCenterKey, setReCenterKey] = useState(0)

  const parking = useParking(refreshInterval)
  const bikes = useBikes(refreshInterval)
  const geo = useGeolocation()
  const { width: sidebarWidth, isDragging, handleMouseDown: handleResizeMouseDown } = useSidebarResize()
  const { isDark, toggle: toggleDark } = useDarkMode()
  const { favorites, isFavorite, toggle: toggleFavorite } = useFavorites()

  const anyError = parking.error || bikes.error

  function handleReCenter() {
    geo.request()
    setReCenterKey((k) => k + 1)
  }

  return (
    <div className="app">
      {anyError && (
        <div className="error-banner" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {t('error.load')}
        </div>
      )}

      {(parking.loading && parking.data.length === 0 && bikes.loading && bikes.data.length === 0) && (
        <div className="loading-overlay">
          <div className="spinner" />
          <span>{t('loading')}</span>
        </div>
      )}

      <Sidebar
        spots={parking.data}
        selectedSpot={selectedSpot}
        onSelectSpot={setSelectedSpot}
        parkingLastUpdated={parking.lastUpdated}
        parkingLoading={parking.loading}
        onRefreshParking={parking.refresh}
        bikeStations={bikes.data}
        selectedStation={selectedStation}
        onSelectStation={setSelectedStation}
        bikeLastUpdated={bikes.lastUpdated}
        bikeLoading={bikes.loading}
        onRefreshBikes={bikes.refresh}
        refreshInterval={refreshInterval}
        onIntervalChange={setRefreshInterval}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showParking={showParking}
        onToggleParking={() => setShowParking((v) => !v)}
        showBikes={showBikes}
        onToggleBikes={() => setShowBikes((v) => !v)}
        width={sidebarWidth}
        onResizeHandleMouseDown={handleResizeMouseDown}
        userPosition={geo.position}
        isDark={isDark}
        onToggleDark={toggleDark}
        favorites={favorites}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
      />

      <main
        className="map-container"
        style={isDragging ? { pointerEvents: 'none' } : undefined}
      >
        <Map
          spots={parking.data}
          selectedSpot={selectedSpot}
          onSelectSpot={setSelectedSpot}
          bikeStations={bikes.data}
          selectedStation={selectedStation}
          onSelectStation={setSelectedStation}
          searchQuery={searchQuery}
          activeTab={activeTab}
          showParking={showParking}
          showBikes={showBikes}
          userPosition={geo.position}
          reCenterKey={reCenterKey}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />

        {geo.position && (
          <button
            className="recenter-btn"
            onClick={handleReCenter}
            aria-label={t('geo.recenter')}
            title={t('geo.recenter')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </button>
        )}
      </main>
    </div>
  )
}
