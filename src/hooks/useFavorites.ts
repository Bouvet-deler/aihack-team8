import { useState, useCallback } from 'react'

const STORAGE_KEY = 'favorites'

interface FavoritesStore {
  parking: string[]
  bikes: string[]
  scooters: string[]
  charging: string[]
}

function load(): FavoritesStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (
        parsed &&
        Array.isArray(parsed.parking) &&
        Array.isArray(parsed.bikes)
      ) {
        return { parking: parsed.parking, bikes: parsed.bikes, scooters: parsed.scooters ?? [], charging: parsed.charging ?? [] } as FavoritesStore
      }
    }
  } catch {
    // ignore
  }
  return { parking: [], bikes: [], scooters: [], charging: [] }
}

function save(store: FavoritesStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // ignore
  }
}

interface UseFavoritesResult {
  favorites: FavoritesStore
  isFavorite: (type: 'parking' | 'bikes' | 'scooters' | 'charging', id: string) => boolean
  toggle: (type: 'parking' | 'bikes' | 'scooters' | 'charging', id: string) => void
}

export function useFavorites(): UseFavoritesResult {
  const [favorites, setFavorites] = useState<FavoritesStore>(load)

  const isFavorite = useCallback(
    (type: 'parking' | 'bikes' | 'scooters' | 'charging', id: string) => favorites[type].includes(id),
    [favorites],
  )

  const toggle = useCallback((type: 'parking' | 'bikes' | 'scooters' | 'charging', id: string) => {
    setFavorites((prev) => {
      const list = prev[type]
      const next = list.includes(id)
        ? list.filter((x) => x !== id)
        : [...list, id]
      const updated = { ...prev, [type]: next }
      save(updated)
      return updated
    })
  }, [])

  return { favorites, isFavorite, toggle }
}
