export interface Scooter {
  vehicle_id: string
  lat: number
  lon: number
  operator: string
  battery_pct: number      // 0–100
  range_meters: number
  is_disabled: boolean
  is_reserved: boolean
  last_reported?: string
}
