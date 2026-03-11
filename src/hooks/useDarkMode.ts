import { useState, useEffect } from 'react'

const STORAGE_KEY = 'theme'

function getInitialDark(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark') return true
    if (stored === 'light') return false
  } catch {
    // ignore
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(isDark: boolean) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
}

interface UseDarkModeResult {
  isDark: boolean
  toggle: () => void
}

export function useDarkMode(): UseDarkModeResult {
  const [isDark, setIsDark] = useState(() => {
    const dark = getInitialDark()
    applyTheme(dark)
    return dark
  })

  // Listen for OS preference changes (only when no manual preference stored)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    function onOsChange(e: MediaQueryListEvent) {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) {
          setIsDark(e.matches)
          applyTheme(e.matches)
        }
      } catch {
        // ignore
      }
    }
    mq.addEventListener('change', onOsChange)
    return () => mq.removeEventListener('change', onOsChange)
  }, [])

  function toggle() {
    setIsDark((prev) => {
      const next = !prev
      applyTheme(next)
      try {
        localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
      } catch {
        // ignore
      }
      return next
    })
  }

  return { isDark, toggle }
}
