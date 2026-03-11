import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
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
}: MapProps) {
  return (
    <MapContainer
      center={STAVANGER_CENTER}
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
    </MapContainer>
  )
}
