import { useState, useCallback, useEffect } from 'react'

interface UseGeolocationResult {
  position: GeolocationCoordinates | null
  error: GeolocationPositionError | null
  request: () => void
}

export function useGeolocation(): UseGeolocationResult {
  const [position, setPosition] = useState<GeolocationCoordinates | null>(null)
  const [error, setError] = useState<GeolocationPositionError | null>(null)

  const request = useCallback(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition(pos.coords)
        setError(null)
      },
      (err) => {
        setError(err)
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 30_000 },
    )
  }, [])

  useEffect(() => {
    request()
  }, [request])

  return { position, error, request }
}
