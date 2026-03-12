export interface ChargingStation {
  id: string              // NOBIL International_id e.g. "NOR_00041"
  name: string
  address: string
  city: string
  lat: number
  lon: number
  numPoints: number       // Total charging points
  availablePoints: number // Available charging points
  connectors: string[]    // e.g. ["CCS", "CHAdeMO", "Type 2"]
  maxCapacity: string     // e.g. "50 kW" (highest power level)
  isPublic: boolean
  open24h: boolean
  owner: string
}
