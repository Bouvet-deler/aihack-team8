import { useState, useCallback, useEffect, useRef } from 'react'

const MIN = 240
const MAX = 480
const DEFAULT = 300
const STORAGE_KEY = 'sidebarWidth'
const MOBILE_BREAKPOINT = 767

function isMobile() {
  return window.innerWidth <= MOBILE_BREAKPOINT
}

function loadWidth(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const n = Number(stored)
      if (Number.isFinite(n)) return Math.max(MIN, Math.min(MAX, n))
    }
  } catch {
    // ignore
  }
  return DEFAULT
}

interface UseSidebarResizeResult {
  width: number | undefined
  isDragging: boolean
  handleMouseDown: (e: React.MouseEvent) => void
}

export function useSidebarResize(): UseSidebarResizeResult {
  const [width, setWidth] = useState<number | undefined>(() =>
    isMobile() ? undefined : loadWidth(),
  )
  const [isDragging, setIsDragging] = useState(false)
  const isDraggingRef = useRef(false)

  // Update width on window resize (mobile ↔ desktop switch)
  useEffect(() => {
    function onWindowResize() {
      if (isMobile()) {
        setWidth(undefined)
      } else {
        setWidth((prev) => prev ?? loadWidth())
      }
    }
    window.addEventListener('resize', onWindowResize)
    return () => window.removeEventListener('resize', onWindowResize)
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isDraggingRef.current = true
    setIsDragging(true)
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'

    function onMouseMove(ev: MouseEvent) {
      if (!isDraggingRef.current) return
      const newWidth = Math.max(MIN, Math.min(MAX, ev.clientX))
      setWidth(newWidth)
    }

    function onMouseUp(ev: MouseEvent) {
      isDraggingRef.current = false
      setIsDragging(false)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      const finalWidth = Math.max(MIN, Math.min(MAX, ev.clientX))
      try {
        localStorage.setItem(STORAGE_KEY, String(finalWidth))
      } catch {
        // ignore
      }
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [])

  return { width, isDragging, handleMouseDown }
}
