export interface TransitStop {
  id: string
  name: string
  latitude: number
  longitude: number
  transportMode: string[]
  distance?: number
}
