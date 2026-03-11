import { useState, useEffect, useCallback, useRef } from 'react'
import type { ParkingSpot } from '../types/parking'
import i18n from '../i18n'

const API_URL = '/api/parking'

function isValidSpot(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  const count = v['Antall_ledige_plasser']
  return (
    typeof v['Dato'] === 'string' &&
    typeof v['Klokkeslett'] === 'string' &&
    typeof v['Sted'] === 'string' &&
    typeof v['Latitude'] === 'string' &&
    typeof v['Longitude'] === 'string' &&
    (typeof count === 'number' || (typeof count === 'string' && Number.isFinite(Number(count))))
  )
}

interface UseParkingResult {
  data: ParkingSpot[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  refresh: () => void
}

export function useParking(intervalMs: number): UseParkingResult {
  const [data, setData] = useState<ParkingSpot[]>([])
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
      const json: ParkingSpot[] = raw.filter(isValidSpot).map((v) => ({
        Dato: v['Dato'] as string,
        Klokkeslett: v['Klokkeslett'] as string,
        Sted: v['Sted'] as string,
        Latitude: v['Latitude'] as string,
        Longitude: v['Longitude'] as string,
        Antall_ledige_plasser: Number(v['Antall_ledige_plasser']),
      }))
      setData(json)
      setLastUpdated(new Date())
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message || i18n.t('error.unknown'))
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
