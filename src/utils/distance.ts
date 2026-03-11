const R = 6371000 // Earth radius in metres

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

export function haversineMetres(
  lat1: number, lon1: number,
  lat2: number, lon2: number,
): number {
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formatDistance(metres: number): string {
  if (metres < 1000) return `${Math.round(metres)} m`
  return `${(metres / 1000).toFixed(1)} km`
}

// Walking speed ~5 km/h = 83.3 m/min
export function formatWalkingTime(metres: number): string {
  const minutes = Math.round(metres / 83.3)
  if (minutes < 1) return '🚶 < 1 min'
  if (minutes < 60) return `🚶 ${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins === 0 ? `🚶 ${hours} t` : `🚶 ${hours} t ${mins} min`
}
