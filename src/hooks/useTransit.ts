import { useState, useEffect, useCallback, useRef } from 'react'
import type { TransitStop } from '../types/transit'

const ENTUR_URL = '/api/transit'
const CLIENT_NAME = 'team8-stavanger-mobility'

// Stavanger city centre
const CENTER_LAT = 58.97
const CENTER_LON = 5.73
const RADIUS_M = 8000
const MAX_RESULTS = 200

const QUERY = `{
  nearest(
    latitude: ${CENTER_LAT}
    longitude: ${CENTER_LON}
    maximumDistance: ${RADIUS_M}
    maximumResults: ${MAX_RESULTS}
    filterByPlaceTypes: [stopPlace]
  ) {
    edges {
      node {
        distance
        place {
          ... on StopPlace {
            id
            name
            latitude
            longitude
            transportMode
          }
        }
      }
    }
  }
}`

function isValidStop(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v['id'] === 'string' &&
    typeof v['name'] === 'string' &&
    typeof v['latitude'] === 'number' &&
    typeof v['longitude'] === 'number' &&
    Array.isArray(v['transportMode'])
  )
}

interface UseTransitResult {
  data: TransitStop[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  refresh: () => void
}

export function useTransit(intervalMs: number): UseTransitResult {
  const [data, setData] = useState<TransitStop[]>([])
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
      const response = await fetch(ENTUR_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ET-Client-Name': CLIENT_NAME,
        },
        body: JSON.stringify({ query: QUERY }),
        signal: controller.signal,
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const json = await response.json()
      const edges = json?.data?.nearest?.edges

      if (!Array.isArray(edges)) throw new Error('Unexpected API response format')

      const stops: TransitStop[] = edges
        .map((edge: unknown): TransitStop | null => {
          if (typeof edge !== 'object' || edge === null) return null
          const e = edge as Record<string, unknown>
          const node = e['node'] as Record<string, unknown> | undefined
          if (!node) return null
          const place = node['place']
          const distance = typeof node['distance'] === 'number' ? node['distance'] : undefined
          if (!isValidStop(place)) return null
          const p = place as Record<string, unknown>
          return {
            id: p['id'] as string,
            name: p['name'] as string,
            latitude: p['latitude'] as number,
            longitude: p['longitude'] as number,
            transportMode: p['transportMode'] as string[],
            distance,
          }
        })
        .filter((s): s is TransitStop => s !== null)

      setData(stops)
      setLastUpdated(new Date())
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message || 'Unknown error')
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
