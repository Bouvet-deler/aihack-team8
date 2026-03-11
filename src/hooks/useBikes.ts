import { useState, useEffect, useCallback, useRef } from 'react'
import type { BikeStation } from '../types/bike'
import type { CityConfig } from '../config/cities'
import i18n from '../i18n'

interface UseBikesResult {
  data: BikeStation[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  refresh: () => void
}

// Validator for opencom.no pre-processed format
function isValidOpencomStation(value: unknown): value is BikeStation {
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

async function fetchOpencom(url: string, signal: AbortSignal): Promise<BikeStation[]> {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const raw: unknown = await response.json()
  if (!Array.isArray(raw)) throw new Error('Unexpected API response format')
  return raw.filter(isValidOpencomStation)
}

async function fetchGbfs(baseUrl: string, signal: AbortSignal): Promise<BikeStation[]> {
  const [infoRes, statusRes] = await Promise.all([
    fetch(`${baseUrl}/station_information.json`, { signal }),
    fetch(`${baseUrl}/station_status.json`, { signal }),
  ])
  if (!infoRes.ok) throw new Error(`HTTP ${infoRes.status}`)
  if (!statusRes.ok) throw new Error(`HTTP ${statusRes.status}`)

  const infoJson = await infoRes.json()
  const statusJson = await statusRes.json()

  const infoMap = new Map<string, Record<string, unknown>>()
  for (const s of infoJson?.data?.stations ?? []) {
    if (typeof s?.station_id === 'string') infoMap.set(s.station_id, s)
  }

  const stations: BikeStation[] = []
  for (const s of statusJson?.data?.stations ?? []) {
    if (typeof s?.station_id !== 'string') continue
    const info = infoMap.get(s.station_id)
    if (!info) continue
    stations.push({
      station_id: s.station_id,
      name: String(info['name'] ?? ''),
      lat: Number(info['lat']),
      lon: Number(info['lon']),
      capacity: Number(info['capacity'] ?? 0),
      num_vehicles_available: Number(s['num_bikes_available'] ?? 0),
      num_docks_available: Number(s['num_docks_available'] ?? 0),
      is_renting: Boolean(s['is_renting']),
      is_returning: Boolean(s['is_returning']),
      last_reported: new Date(Number(s['last_reported']) * 1000).toISOString(),
    })
  }
  return stations
}

export function useBikes(intervalMs: number, city: CityConfig): UseBikesResult {
  const [data, setData] = useState<BikeStation[]>([])
  const [loading, setLoading] = useState(!!city.bikes)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const fetchData = useCallback(async () => {
    if (!city.bikes) return
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      setError(null)
      const stations =
        city.bikes.type === 'gbfs'
          ? await fetchGbfs(city.bikes.url, controller.signal)
          : await fetchOpencom(city.bikes.url, controller.signal)
      setData(stations)
      setLastUpdated(new Date())
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message || i18n.t('error.unknown'))
      }
    } finally {
      setLoading(false)
    }
  }, [city])

  useEffect(() => {
    if (!city.bikes) {
      setData([])
      setLoading(false)
      setError(null)
      return
    }
    setLoading(true)
    fetchData()
    const timer = setInterval(fetchData, intervalMs)
    return () => {
      clearInterval(timer)
      abortRef.current?.abort()
    }
  }, [fetchData, intervalMs, city])

  return { data, loading, error, lastUpdated, refresh: fetchData }
}
