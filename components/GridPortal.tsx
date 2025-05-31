import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

export function GridPortal() {
  const gridRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!gridRef.current) return
    document.body.appendChild(gridRef.current)
    return () => {
      if (gridRef.current && gridRef.current.parentNode) {
        gridRef.current.parentNode.removeChild(gridRef.current)
      }
    }
  }, [])
  return createPortal(
    <div
      ref={gridRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.25,
        backgroundImage:
          'linear-gradient(to right, #2d3748 1px, transparent 1px), linear-gradient(to bottom, #2d3748 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />,
    document.body
  )
} 