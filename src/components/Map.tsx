import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { ParkingSpot } from '../types/parking'
import type { BikeStation } from '../types/bike'
import { ParkingMarker } from './ParkingMarker'
import { BikeMarker } from './BikeMarker'

const STAVANGER_CENTER: [number, number] = [58.97, 5.73]
const DEFAULT_ZOOM = 13

function FlyToSpot({ spot }: { spot: ParkingSpot | null }) {
  const map = useMap()
  const prevRef = useRef<string | null>(null)

  useEffect(() => {
    if (!spot) return
    const key = spot.Sted
    if (key === prevRef.current) return
    prevRef.current = key
    const lat = parseFloat(spot.Latitude)
    const lng = parseFloat(spot.Longitude)
    if (!isNaN(lat) && !isNaN(lng)) map.flyTo([lat, lng], 15, { duration: 0.8 })
  }, [spot, map])

  return null
}

function FlyToStation({ station }: { station: BikeStation | null }) {
  const map = useMap()
  const prevRef = useRef<string | null>(null)

  useEffect(() => {
    if (!station) return
    if (station.station_id === prevRef.current) return
    prevRef.current = station.station_id
    map.flyTo([station.lat, station.lon], 15, { duration: 0.8 })
  }, [station, map])

  return null
}

const userLocationIcon = divIcon({
  className: '',
  html: `
    <div style="
      width: 20px;
      height: 20px;
      background: #2563eb;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 0 2px #2563eb, 0 2px 8px rgba(0,0,0,0.4);
      animation: geo-pulse 2s ease-in-out infinite;
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

function UserLocationLayer({
  position,
  reCenterKey,
}: {
  position: GeolocationCoordinates | null
  reCenterKey: number
}) {
  const map = useMap()
  const hasFlownRef = useRef(false)

  // Fly to user on first fix
  useEffect(() => {
    if (!position || hasFlownRef.current) return
    hasFlownRef.current = true
    map.flyTo([position.latitude, position.longitude], 15, { duration: 1.2 })
  }, [position, map])

  // Fly on explicit re-center request
  useEffect(() => {
    if (reCenterKey === 0 || !position) return
    map.flyTo([position.latitude, position.longitude], 15, { duration: 0.8 })
  }, [reCenterKey, position, map])

  if (!position) return null

  return (
    <Marker
      position={[position.latitude, position.longitude]}
      icon={userLocationIcon}
    />
  )
}

const TILE_LIGHT = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}

const TILE_DARK = {
  url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
}

interface MapProps {
  spots: ParkingSpot[]
  selectedSpot: ParkingSpot | null
  onSelectSpot: (spot: ParkingSpot) => void
  bikeStations: BikeStation[]
  selectedStation: BikeStation | null
  onSelectStation: (station: BikeStation) => void
  searchQuery: string
  activeTab: 'parking' | 'bikes'
  showParking: boolean
  showBikes: boolean
  userPosition: GeolocationCoordinates | null
  reCenterKey: number
  isDark: boolean
}

export function Map({
  spots,
  selectedSpot,
  onSelectSpot,
  bikeStations,
  selectedStation,
  onSelectStation,
  searchQuery,
  activeTab,
  showParking,
  showBikes,
  userPosition,
  reCenterKey,
  isDark,
}: MapProps) {
  const tile = isDark ? TILE_DARK : TILE_LIGHT

  return (
    <MapContainer
      center={STAVANGER_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer key={isDark ? 'dark' : 'light'} attribution={tile.attribution} url={tile.url} />

      {showParking && spots.map((spot) => {
        const matches =
          activeTab !== 'parking' ||
          !searchQuery ||
          spot.Sted.toLowerCase().includes(searchQuery.toLowerCase())
        return (
          <ParkingMarker
            key={spot.Sted}
            spot={spot}
            isSelected={selectedSpot?.Sted === spot.Sted}
            dimmed={!matches}
            onClick={() => onSelectSpot(spot)}
          />
        )
      })}

      {showBikes && bikeStations.map((station) => {
        const matches =
          activeTab !== 'bikes' ||
          !searchQuery ||
          station.name.toLowerCase().includes(searchQuery.toLowerCase())
        return (
          <BikeMarker
            key={station.station_id}
            station={station}
            isSelected={selectedStation?.station_id === station.station_id}
            dimmed={!matches}
            onClick={() => onSelectStation(station)}
          />
        )
      })}

      <FlyToSpot spot={selectedSpot} />
      <FlyToStation station={selectedStation} />
      <UserLocationLayer position={userPosition} reCenterKey={reCenterKey} />
    </MapContainer>
  )
}
