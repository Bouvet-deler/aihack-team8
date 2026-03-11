import { useState } from 'react'
import { CITIES, DEFAULT_CITY } from '../config/cities'
import type { CityConfig } from '../config/cities'

export function useCity() {
  const [city, setCity] = useState<CityConfig>(() => {
    try {
      const saved = localStorage.getItem('city')
      return CITIES.find((c) => c.id === saved) ?? DEFAULT_CITY
    } catch {
      return DEFAULT_CITY
    }
  })

  function selectCity(c: CityConfig) {
    setCity(c)
    try { localStorage.setItem('city', c.id) } catch { /* ignore */ }
  }

  return { city, selectCity, cities: CITIES }
}
