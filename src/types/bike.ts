export interface BikeStation {
  station_id: string
  name: string
  lat: number
  lon: number
  capacity: number
  num_vehicles_available: number
  num_docks_available: number
  is_renting: boolean
  is_returning: boolean
  last_reported: string
}
