import { useState, useEffect, useCallback, useRef } from 'react'
import type { ChargingStation } from '../types/charging'
import type { CityConfig } from '../config/cities'
import i18n from '../i18n'

interface UseChargingResult {
  data: ChargingStation[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  refresh: () => void
}

/**
 * Sample data for Stavanger EV charging stations.
 * Based on real locations — will be replaced with NOBIL API when key is available.
 */
const SAMPLE_STAVANGER: ChargingStation[] = [
  {
    id: 'NOR_01234',
    name: 'Stavanger Sentrum Hurtiglader',
    address: 'Klubbgata 1',
    city: 'Stavanger',
    lat: 58.9701,
    lon: 5.7333,
    numPoints: 4,
    availablePoints: 2,
    connectors: ['CCS', 'CHAdeMO'],
    maxCapacity: '150 kW',
    isPublic: true,
    open24h: true,
    owner: 'Mer',
  },
  {
    id: 'NOR_01235',
    name: 'Kilden Kjøpesenter',
    address: 'Sølvberggata 2',
    city: 'Stavanger',
    lat: 58.9720,
    lon: 5.7280,
    numPoints: 8,
    availablePoints: 5,
    connectors: ['CCS', 'Type 2'],
    maxCapacity: '50 kW',
    isPublic: true,
    open24h: false,
    owner: 'Circle K',
  },
  {
    id: 'NOR_01236',
    name: 'Forus Hurtigladestasjon',
    address: 'Forusbeen 35',
    city: 'Stavanger',
    lat: 58.8936,
    lon: 5.7337,
    numPoints: 12,
    availablePoints: 8,
    connectors: ['CCS', 'CHAdeMO', 'Type 2'],
    maxCapacity: '300 kW',
    isPublic: true,
    open24h: true,
    owner: 'Tesla / Mer',
  },
  {
    id: 'NOR_01237',
    name: 'Madla Handelssenter',
    address: 'Madlaveien 28',
    city: 'Stavanger',
    lat: 58.9487,
    lon: 5.6952,
    numPoints: 6,
    availablePoints: 6,
    connectors: ['Type 2'],
    maxCapacity: '22 kW',
    isPublic: true,
    open24h: false,
    owner: 'Kople',
  },
  {
    id: 'NOR_01238',
    name: 'Byterminalen Stavanger',
    address: 'Jernbaneveien 10',
    city: 'Stavanger',
    lat: 58.9684,
    lon: 5.7349,
    numPoints: 6,
    availablePoints: 1,
    connectors: ['CCS', 'Type 2'],
    maxCapacity: '100 kW',
    isPublic: true,
    open24h: true,
    owner: 'Recharge',
  },
  {
    id: 'NOR_01239',
    name: 'Hillevåg Ladestasjon',
    address: 'Hillevågsveien 100',
    city: 'Stavanger',
    lat: 58.9516,
    lon: 5.7248,
    numPoints: 4,
    availablePoints: 0,
    connectors: ['CCS', 'CHAdeMO'],
    maxCapacity: '50 kW',
    isPublic: true,
    open24h: true,
    owner: 'Ionity',
  },
  {
    id: 'NOR_01240',
    name: 'Hundvåg Nærsenter',
    address: 'Hundvågveien 64',
    city: 'Stavanger',
    lat: 58.9825,
    lon: 5.7460,
    numPoints: 4,
    availablePoints: 3,
    connectors: ['Type 2'],
    maxCapacity: '11 kW',
    isPublic: true,
    open24h: false,
    owner: 'BKK',
  },
  {
    id: 'NOR_01241',
    name: 'Tasta Ladepunkt',
    address: 'Tastamyrveien 22',
    city: 'Stavanger',
    lat: 58.9873,
    lon: 5.7089,
    numPoints: 2,
    availablePoints: 2,
    connectors: ['Type 2'],
    maxCapacity: '22 kW',
    isPublic: true,
    open24h: true,
    owner: 'Easee',
  },
  {
    id: 'NOR_01242',
    name: 'Mariero Hurtiglader',
    address: 'Ullandhaugveien 5',
    city: 'Stavanger',
    lat: 58.9421,
    lon: 5.7101,
    numPoints: 8,
    availablePoints: 4,
    connectors: ['CCS', 'CHAdeMO', 'Type 2'],
    maxCapacity: '150 kW',
    isPublic: true,
    open24h: true,
    owner: 'Mer',
  },
]

function getSampleData(cityId: string): ChargingStation[] {
  if (cityId === 'stavanger') return SAMPLE_STAVANGER
  // For other cities, return empty for now — will be populated by NOBIL API
  return []
}

export function useCharging(intervalMs: number, city: CityConfig): UseChargingResult {
  const [data, setData] = useState<ChargingStation[]>([])
  const [loading, setLoading] = useState(!!city.charging)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const fetchData = useCallback(async () => {
    if (!city.charging) return
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      setError(null)

      // TODO: Replace with real NOBIL API call when API key is available
      // const res = await fetch(city.charging.url, { signal: controller.signal, method: 'POST', ... })
      // For now, use sample data with simulated network delay
      await new Promise((resolve) => setTimeout(resolve, 300))
      if (controller.signal.aborted) return

      const stations = getSampleData(city.id)
      // Simulate slight availability changes on refresh
      const varied = stations.map((s) => ({
        ...s,
        availablePoints: Math.max(0, Math.min(s.numPoints,
          s.availablePoints + Math.floor(Math.random() * 3) - 1,
        )),
      }))

      setData(varied)
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
    if (!city.charging) {
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
