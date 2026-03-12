import { useState, useCallback, useEffect, useRef } from 'react'

interface UseGeolocationResult {
  position: GeolocationCoordinates | null
  error: GeolocationPositionError | null
  request: () => void
}

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 8000,
  maximumAge: 30_000,
}

export function useGeolocation(): UseGeolocationResult {
  const [position, setPosition] = useState<GeolocationCoordinates | null>(null)
  const [error, setError] = useState<GeolocationPositionError | null>(null)
  const watchIdRef = useRef<number | null>(null)

  const startWatch = useCallback(() => {
    if (!navigator.geolocation) return

    // Clear any existing watch before starting a new one
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition(pos.coords)
        setError(null)
      },
      (err) => {
        setError(err)
      },
      GEO_OPTIONS,
    )
  }, [])

  useEffect(() => {
    // Don't request geolocation on page load - wait for explicit user action
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [startWatch])

  return { position, error, request: startWatch }
}
