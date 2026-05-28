'use client'

import { useState, useEffect, useRef } from 'react'

export function useInView(options: IntersectionObserverInit = {}): {
  ref: React.RefObject<Element | null>
  inView: boolean
} {
  const ref = useRef<Element | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, ...options }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { ref, inView }
}
