'use client'

import { useState, useEffect } from 'react'

export function useTypewriter(
  text: string,
  speed: number = 16
): { out: string; done: boolean } {
  const [out, setOut] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setOut('')
    setDone(false)
    if (!text) return

    let i = 0
    const id = setInterval(() => {
      i += 2 + Math.floor(Math.random() * 3)
      if (i >= text.length) {
        setOut(text)
        setDone(true)
        clearInterval(id)
      } else {
        setOut(text.slice(0, i))
      }
    }, speed)

    return () => clearInterval(id)
  }, [text, speed])

  return { out, done }
}
