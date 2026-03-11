import { useState, useEffect, useCallback, useRef } from 'react'
import type { BikeStation } from '../types/bike'

const API_URL = '/api/bikes'

interface UseBikesResult {
  data: BikeStation[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  refresh: () => void
}

function isValidStation(value: unknown): value is BikeStation {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v['station_id'] === 'string' &&
    typeof v['name'] === 'string' &&
    typeof v['lat'] === 'number' &&
    typeof v['lon'] === 'number' &&
    typeof v['capacity'] === 'number' &&
    typeof v['num_vehicles_available'] === 'number' &&
    typeof v['num_docks_available'] === 'number' &&
    typeof v['is_renting'] === 'boolean' &&
    typeof v['is_returning'] === 'boolean' &&
    typeof v['last_reported'] === 'string'
  )
}

export function useBikes(intervalMs: number): UseBikesResult {
  const [data, setData] = useState<BikeStation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const fetchData = useCallback(async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      setError(null)
      const response = await fetch(API_URL, { signal: controller.signal })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const raw: unknown = await response.json()
      if (!Array.isArray(raw)) throw new Error('Unexpected API response format')
      setData(raw.filter(isValidStation))
      setLastUpdated(new Date())
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message || 'Ukjent feil')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchData()
    const timer = setInterval(fetchData, intervalMs)
    return () => {
      clearInterval(timer)
      abortRef.current?.abort()
    }
  }, [fetchData, intervalMs])

  return { data, loading, error, lastUpdated, refresh: fetchData }
}
