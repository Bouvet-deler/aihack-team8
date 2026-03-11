import { useState } from 'react'
import { CITIES, DEFAULT_CITY } from '../config/cities'
import type { CityConfig } from '../config/cities'

export function useCity() {
  const [city, setCity] = useState<CityConfig>(() => {
    const saved = localStorage.getItem('city')
    return CITIES.find((c) => c.id === saved) ?? DEFAULT_CITY
  })

  function selectCity(c: CityConfig) {
    setCity(c)
    localStorage.setItem('city', c.id)
  }

  return { city, selectCity, cities: CITIES }
}
