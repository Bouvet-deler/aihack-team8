import { useState, useEffect, useCallback, useRef } from 'react'
import type { Scooter } from '../types/scooter'
import type { CityConfig } from '../config/cities'
import i18n from '../i18n'

interface UseScootersResult {
  data: Scooter[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  refresh: () => void
}

function isValidVehicle(v: unknown): v is Record<string, unknown> {
  if (typeof v !== 'object' || v === null) return false
  const r = v as Record<string, unknown>
  return (
    typeof r['vehicle_id'] === 'string' &&
    typeof r['lat'] === 'number' &&
    typeof r['lon'] === 'number' &&
    typeof r['is_disabled'] === 'boolean'
  )
}

async function fetchGbfsVehicles(
  url: string,
  operator: string,
  maxRangeMeters: number,
  signal: AbortSignal,
): Promise<Scooter[]> {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()

  const vehicles = json?.data?.vehicles ?? []
  const scooters: Scooter[] = []

  for (const v of vehicles) {
    if (!isValidVehicle(v)) continue
    if (v['is_reserved'] === true) continue

    const rangeMeta = Number(v['current_range_meters'] ?? 0)
    const fuelPct = v['current_fuel_percent']
    const battery = typeof fuelPct === 'number'
      ? Math.round(fuelPct * 100)
      : maxRangeMeters > 0
        ? Math.round((rangeMeta / maxRangeMeters) * 100)
        : 0

    scooters.push({
      vehicle_id: String(v['vehicle_id']),
      lat: Number(v['lat']),
      lon: Number(v['lon']),
      operator,
      battery_pct: Math.min(100, Math.max(0, battery)),
      range_meters: rangeMeta,
      is_disabled: Boolean(v['is_disabled']),
      is_reserved: Boolean(v['is_reserved']),
    })
  }
  return scooters
}

export function useScooters(intervalMs: number, city: CityConfig): UseScootersResult {
  const [data, setData] = useState<Scooter[]>([])
  const [loading, setLoading] = useState(!!city.scooters)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const fetchData = useCallback(async () => {
    if (!city.scooters || city.scooters.length === 0) return
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      setError(null)
      const results = await Promise.all(
        city.scooters.map((cfg) =>
          fetchGbfsVehicles(cfg.url, cfg.operator, cfg.maxRange, controller.signal),
        ),
      )
      setData(results.flat())
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
    if (!city.scooters || city.scooters.length === 0) {
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
