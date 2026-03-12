import { useEffect, useLayoutEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { divIcon } from 'leaflet'
import type { Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { ParkingSpot } from '../types/parking'
import type { BikeStation } from '../types/bike'
import type { Scooter } from '../types/scooter'
import { ParkingMarker } from './ParkingMarker'
import { BikeMarker } from './BikeMarker'
import { ScooterMarker } from './ScooterMarker'
import { TransitMarker } from './TransitMarker'
import type { TransitStop } from '../types/transit'
import type { CityConfig } from '../config/cities'

const DEFAULT_CENTER: [number, number] = [58.97, 5.73]
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


/** Captures the Leaflet map instance into a ref so the Map component can
 *  call map methods (flyTo) from a useEffect outside the MapContainer tree. */
function MapRefCapture({ mapRef }: { mapRef: React.MutableRefObject<LeafletMap | null> }) {
  const map = useMap()
  useLayoutEffect(() => { mapRef.current = map }, [map])
  return null
}

interface MapProps {
  spots: ParkingSpot[]
  selectedSpot: ParkingSpot | null
  onSelectSpot: (spot: ParkingSpot) => void
  bikeStations: BikeStation[]
  selectedStation: BikeStation | null
  onSelectStation: (station: BikeStation) => void
  scooters: Scooter[]
  selectedScooter: Scooter | null
  onSelectScooter: (scooter: Scooter) => void
  transitStops: TransitStop[]
  selectedTransitStop: TransitStop | null
  onSelectTransitStop: (stop: TransitStop) => void
  searchQuery: string
  activeTab: 'parking' | 'bikes' | 'scooters' | 'transit'
  showParking: boolean
  showBikes: boolean
  showScooters: boolean
  showTransit: boolean
  userPosition: GeolocationCoordinates | null
  reCenterKey: number
  isFavorite: (type: 'parking' | 'bikes' | 'scooters', id: string) => boolean
  onToggleFavorite: (type: 'parking' | 'bikes' | 'scooters', id: string) => void
  city: CityConfig
}

export function Map({
  spots,
  selectedSpot,
  onSelectSpot,
  bikeStations,
  selectedStation,
  onSelectStation,
  scooters,
  selectedScooter,
  onSelectScooter,
  transitStops,
  selectedTransitStop,
  onSelectTransitStop,
  searchQuery,
  activeTab,
  showParking,
  showBikes,
  showScooters,
  showTransit,
  userPosition,
  reCenterKey,
  isFavorite,
  onToggleFavorite,
  city,
}: MapProps) {
  const mapRef = useRef<LeafletMap | null>(null)

  // Fly to new city center when city changes
  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.flyTo(city.center, city.zoom, { duration: 1.0 })
  }, [city])

  useEffect(() => {
    if (!selectedTransitStop || !mapRef.current) return
    mapRef.current.flyTo(
      [selectedTransitStop.latitude, selectedTransitStop.longitude],
      15,
      { duration: 0.8 },
    )
  }, [selectedTransitStop])

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

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
            isFavorite={isFavorite('parking', spot.Sted)}
            onClick={() => onSelectSpot(spot)}
            onToggleFavorite={() => onToggleFavorite('parking', spot.Sted)}
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
            isFavorite={isFavorite('bikes', station.station_id)}
            onClick={() => onSelectStation(station)}
            onToggleFavorite={() => onToggleFavorite('bikes', station.station_id)}
          />
        )
      })}

      {showScooters && scooters.map((scooter) => {
        const matches =
          activeTab !== 'scooters' ||
          !searchQuery ||
          scooter.operator.toLowerCase().includes(searchQuery.toLowerCase())
        return (
          <ScooterMarker
            key={scooter.vehicle_id}
            scooter={scooter}
            isSelected={selectedScooter?.vehicle_id === scooter.vehicle_id}
            dimmed={!matches}
            isFavorite={isFavorite('scooters', scooter.vehicle_id)}
            onClick={() => onSelectScooter(scooter)}
            onToggleFavorite={() => onToggleFavorite('scooters', scooter.vehicle_id)}
          />
        )
      })}

      {showTransit && transitStops.map((stop) => {
        const matches =
          activeTab !== 'transit' ||
          !searchQuery ||
          stop.name.toLowerCase().includes(searchQuery.toLowerCase())
        return (
          <TransitMarker
            key={stop.id}
            stop={stop}
            isSelected={selectedTransitStop?.id === stop.id}
            dimmed={!matches}
            onClick={() => onSelectTransitStop(stop)}
          />
        )
      })}

      <MapRefCapture mapRef={mapRef} />
      <FlyToSpot spot={selectedSpot} />
      <FlyToStation station={selectedStation} />
      <UserLocationLayer position={userPosition} reCenterKey={reCenterKey} />
    </MapContainer>
  )
}
