import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Map } from './components/Map'
import { Sidebar } from './components/Sidebar'
import { useParking } from './hooks/useParking'
import { useBikes } from './hooks/useBikes'
import { useScooters } from './hooks/useScooters'
import { useTransit } from './hooks/useTransit'
import { useGeolocation } from './hooks/useGeolocation'
import { useSidebarResize } from './hooks/useSidebarResize'
import { useDarkMode } from './hooks/useDarkMode'
import { useFavorites } from './hooks/useFavorites'
import { useCity } from './hooks/useCity'
import type { ParkingSpot } from './types/parking'
import type { BikeStation } from './types/bike'
import type { Scooter } from './types/scooter'
import type { TransitStop } from './types/transit'
import './App.css'

const DEFAULT_INTERVAL = 60_000

export default function App() {
  const { t } = useTranslation()
  const [refreshInterval, setRefreshInterval] = useState(DEFAULT_INTERVAL)
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null)
  const [selectedStation, setSelectedStation] = useState<BikeStation | null>(null)
  const [selectedScooter, setSelectedScooter] = useState<Scooter | null>(null)
  const [selectedTransitStop, setSelectedTransitStop] = useState<TransitStop | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'parking' | 'bikes' | 'scooters' | 'transit'>('parking')
  const [showParking, setShowParking] = useState(true)
  const [showBikes, setShowBikes] = useState(false)
  const [showScooters, setShowScooters] = useState(false)
  const [showTransit, setShowTransit] = useState(false)
  const [reCenterKey, setReCenterKey] = useState(0)

  const { city, selectCity, cities } = useCity()

  function handleSelectCity(c: typeof city) {
    selectCity(c)
    // If the new city has no parking, switch away from the parking tab
    if (!c.parking && activeTab === 'parking') {
      setActiveTab('bikes')
    }
    // Clear selections when switching cities
    setSelectedSpot(null)
    setSelectedStation(null)
    setSelectedScooter(null)
    setSelectedTransitStop(null)
    setSearchQuery('')
  }
  const parking = useParking(refreshInterval, city)
  const bikes = useBikes(refreshInterval, city)
  const scooters = useScooters(refreshInterval, city)
  const transit = useTransit(refreshInterval, city)
  const geo = useGeolocation()
  const { width: sidebarWidth, isDragging, handleMouseDown: handleResizeMouseDown } = useSidebarResize()
  const { isDark, toggle: toggleDark } = useDarkMode()
  const { favorites, isFavorite, toggle: toggleFavorite } = useFavorites()

  const anyError = parking.error || bikes.error || scooters.error || transit.error

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

      {((city.parking ? parking.loading && parking.data.length === 0 : false) ||
        (city.bikes ? bikes.loading && bikes.data.length === 0 : false) ||
        (city.scooters ? scooters.loading && scooters.data.length === 0 : false) ||
        (transit.loading && transit.data.length === 0)) && (
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
        scooters={scooters.data}
        selectedScooter={selectedScooter}
        onSelectScooter={setSelectedScooter}
        scooterLastUpdated={scooters.lastUpdated}
        scooterLoading={scooters.loading}
        onRefreshScooters={scooters.refresh}
        transitStops={transit.data}
        selectedTransitStop={selectedTransitStop}
        onSelectTransitStop={setSelectedTransitStop}
        transitLoading={transit.loading}
        transitLastUpdated={transit.lastUpdated}
        onRefreshTransit={transit.refresh}
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
        showScooters={showScooters}
        onToggleScooters={() => setShowScooters((v) => !v)}
        showTransit={showTransit}
        onToggleTransit={() => setShowTransit((v) => !v)}
        width={sidebarWidth}
        onResizeHandleMouseDown={handleResizeMouseDown}
        userPosition={geo.position}
        onRequestLocation={geo.request}
        isDark={isDark}
        onToggleDark={toggleDark}
        favorites={favorites}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        city={city}
        cities={cities}
        onSelectCity={handleSelectCity}
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
          scooters={scooters.data}
          selectedScooter={selectedScooter}
          onSelectScooter={setSelectedScooter}
          transitStops={transit.data}
          selectedTransitStop={selectedTransitStop}
          onSelectTransitStop={setSelectedTransitStop}
          searchQuery={searchQuery}
          activeTab={activeTab}
          showParking={showParking}
          showBikes={showBikes}
          showScooters={showScooters}
          showTransit={showTransit}
          userPosition={geo.position}
          reCenterKey={reCenterKey}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          city={city}
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
