export interface ParkingConfig {
  url: string
}

export interface BikesConfig {
  /** 'opencom' — single JSON endpoint (Stavanger). 'gbfs' — Urban Sharing standard feeds. */
  type: 'opencom' | 'gbfs'
  /** For opencom: full proxy URL. For gbfs: base path e.g. '/api/gbfs/oslobysykkel.no' */
  url: string
}

export interface ScooterOperatorConfig {
  operator: string
  url: string
  /** Max range in meters for battery estimation when current_fuel_percent is absent */
  maxRange: number
}

export interface TransitConfig {
  lat: number
  lon: number
  radius: number
}

export interface ChargingConfig {
  /** Bounding box for NOBIL rectangle search */
  northeast: [number, number]
  southwest: [number, number]
}

export interface CityConfig {
  id: string
  name: string
  center: [number, number]
  zoom: number
  parking?: ParkingConfig
  bikes?: BikesConfig
  scooters?: ScooterOperatorConfig[]
  charging?: ChargingConfig
  transit: TransitConfig
}

export const CITIES: CityConfig[] = [
  {
    id: 'stavanger',
    name: 'Stavanger',
    center: [58.97, 5.73],
    zoom: 13,
    parking: { url: '/api/parking' },
    bikes: { type: 'opencom', url: '/api/bikes' },
    scooters: [
      { operator: 'Voi', url: '/api/scooters/voi', maxRange: 64000 },
      { operator: 'Ryde', url: '/api/scooters/ryde', maxRange: 56000 },
    ],
    charging: {
      northeast: [59.05, 5.85],
      southwest: [58.88, 5.60],
    },
    transit: { lat: 58.97, lon: 5.73, radius: 8000 },
  },
  {
    id: 'bergen',
    name: 'Bergen',
    center: [60.39, 5.32],
    zoom: 13,
    bikes: { type: 'gbfs', url: '/api/gbfs/bergenbysykkel.no' },
    transit: { lat: 60.39, lon: 5.32, radius: 8000 },
  },
  {
    id: 'trondheim',
    name: 'Trondheim',
    center: [63.43, 10.39],
    zoom: 13,
    bikes: { type: 'gbfs', url: '/api/gbfs/trondheimbysykkel.no' },
    transit: { lat: 63.43, lon: 10.39, radius: 8000 },
  },
  {
    id: 'oslo',
    name: 'Oslo',
    center: [59.91, 10.75],
    zoom: 12,
    bikes: { type: 'gbfs', url: '/api/gbfs/oslobysykkel.no' },
    transit: { lat: 59.91, lon: 10.75, radius: 8000 },
  },
]

export const DEFAULT_CITY = CITIES[0]
