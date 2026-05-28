'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/* ─── Physics / timing constants ─────────────────────────────── */
const SPRING      = 0.095
const DAMPING     = 0.74
const FOLLOW_DIST = 60
const GRAVITY     = 0.52
const INTERACTIVE =
  'a, button, [role="button"], input, select, textarea, label, [tabindex]'

type Mood  = 'idle' | 'shocked' | 'scared'
type Phase = 'idle' | 'spinning' | 'falling' | 'hidden'

interface RobotIconProps {
  mood: Mood
}

function RobotIcon({ mood }: RobotIconProps) {
  const isShocked = mood === 'shocked'
  const isScared  = mood === 'scared'

  const stroke = isShocked ? '#90abf0' : isScared ? '#ff9f7f' : '#4A6FE6'
  const eyeR   = isShocked ? 4.0       : isScared ? 4.2       : 3.2
  const orb    = isShocked ? '#c5d4f8' : isScared ? '#ffb69e' : '#7B97EC'

  return (
    <svg
      width="44" height="58" viewBox="0 0 44 58"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <filter id="rc-f" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={isShocked || isScared ? 3.8 : 1.2}
            result="blur"
          />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="rc-eg" cx="35%" cy="35%" r="65%">
          <stop offset="0%"
            stopColor={isShocked ? '#d0e0ff' : isScared ? '#ffe0d0' : '#8ba7ee'} />
          <stop offset="100%"
            stopColor={isShocked ? '#4A6FE6' : isScared ? '#e06040' : '#2348c0'} />
        </radialGradient>
        <linearGradient id="rc-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#141630" />
          <stop offset="100%" stopColor="#0b0d1e" />
        </linearGradient>
      </defs>

      <g filter="url(#rc-f)">
        <line x1="22" y1="8" x2="22" y2="1.5"
          stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        <circle cx="22" cy="1.5" r="2.8"
          fill={isShocked ? '#c5d4f8' : isScared ? '#ffb69e' : '#4A6FE6'} />

        <rect x="6" y="8" width="32" height="23" rx="9"
          fill="url(#rc-bg)" stroke={stroke} strokeWidth="1.5" />

        <circle cx="14.5" cy="18.5" r="5.5" fill="#0b0e22" />
        <circle cx="14.5" cy="18.5" r={eyeR}  fill="url(#rc-eg)" />
        <circle cx="15.8" cy="17.2" r="1.3"   fill="white" opacity="0.88" />

        <circle cx="29.5" cy="18.5" r="5.5" fill="#0b0e22" />
        <circle cx="29.5" cy="18.5" r={eyeR}  fill="url(#rc-eg)" />
        <circle cx="30.8" cy="17.2" r="1.3"   fill="white" opacity="0.88" />

        {isShocked && (
          <ellipse cx="22" cy="27.5" rx="5.5" ry="4"
            fill="#0a0c1c" stroke="#90abf0" strokeWidth="1.5" />
        )}
        {isScared && (
          <ellipse cx="22" cy="27.5" rx="3.5" ry="2.8"
            fill="#0a0c1c" stroke="#ff9f7f" strokeWidth="1.5" />
        )}
        {!isShocked && !isScared && (
          <rect x="14" y="26" width="16" height="2.5" rx="1.25"
            fill={stroke} opacity="0.6" />
        )}

        <rect x="8" y="33" width="28" height="18" rx="7"
          fill="url(#rc-bg)" stroke={stroke} strokeWidth="1.5" />

        <circle cx="22" cy="42" r="6"
          fill="#0f1228"
          stroke={isShocked ? '#90abf0' : isScared ? '#ff9f7f' : '#3259d4'}
          strokeWidth="1.2" />
        <circle cx="22" cy="42" r="3.2" fill={orb} />
        <circle cx="22" cy="42" r="1.4" fill="white" opacity="0.7" />

        <circle cx="12.5" cy="42" r="1.6" fill="#0f1228" stroke="#2a3d8a" strokeWidth="1" />
        <circle cx="31.5" cy="42" r="1.6" fill="#0f1228" stroke="#2a3d8a" strokeWidth="1" />

        <rect x="-3"  y="34" width="10" height="5.5" rx="2.75"
          fill="url(#rc-bg)" stroke={stroke} strokeWidth="1.5" />
        <rect x="37"  y="34" width="10" height="5.5" rx="2.75"
          fill="url(#rc-bg)" stroke={stroke} strokeWidth="1.5" />

        <rect x="10" y="51" width="9" height="5.5" rx="2.75"
          fill="url(#rc-bg)" stroke={stroke} strokeWidth="1.5" />
        <rect x="25" y="51" width="9" height="5.5" rx="2.75"
          fill="url(#rc-bg)" stroke={stroke} strokeWidth="1.5" />
      </g>
    </svg>
  )
}

export default function RobotCursor() {
  const [mounted,  setMounted]  = useState(false)
  const [isTouch,  setIsTouch]  = useState(false)
  const [visible,  setVisible]  = useState(false)
  const [phase,    setPhase]    = useState<Phase>('idle')
  const [mood,     setMood]     = useState<Mood>('idle')

  const posRef   = useRef<HTMLDivElement | null>(null)
  const swingRef = useRef<HTMLDivElement | null>(null)
  const glowRef  = useRef<HTMLDivElement | null>(null)
  const spinRef  = useRef<HTMLDivElement | null>(null)
  const popRef   = useRef<HTMLDivElement | null>(null)

  const mouseRef     = useRef({ x: -400, y: -400 })
  const robotRef     = useRef({ x: -400, y: -400 + FOLLOW_DIST })
  const velRef       = useRef({ x: 0, y: 0 })
  const fallRef      = useRef({ x: 0, y: 0, vx: 0, vy: 0, angle: 0, t: 0 })
  const phaseRef     = useRef<Phase>('idle')
  const excitedRef   = useRef(false)
  const cooldownRef  = useRef(false)
  const rafRef       = useRef<number | null>(null)
  const respawnTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dismissedRef = useRef(false)

  useEffect(() => { phaseRef.current = phase }, [phase])

  useEffect(() => {
    setMounted(true)
    setIsTouch(
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    )
  }, [])

  const handleSpinEnd = useCallback(() => {
    if (phaseRef.current !== 'spinning') return

    const r = robotRef.current
    fallRef.current = {
      x:  r.x,
      y:  r.y,
      vx: (Math.random() - 0.5) * 5,
      vy: 2,
      angle: 0,
      t: 0,
    }

    phaseRef.current = 'falling'
    setPhase('falling')
    setMood('scared')
  }, [])

  const tick = useCallback(() => {
    const p = phaseRef.current

    if (p === 'idle') {
      const m = mouseRef.current
      const r = robotRef.current
      const v = velRef.current

      const tX = m.x
      const tY = m.y + FOLLOW_DIST
      v.x = v.x * DAMPING + (tX - r.x) * SPRING
      v.y = v.y * DAMPING + (tY - r.y) * SPRING
      r.x += v.x
      r.y += v.y

      const dx         = r.x - m.x
      const dy         = r.y - m.y
      const swingAngle = Math.atan2(dx, dy) * (180 / Math.PI) * 0.6

      if (posRef.current)
        posRef.current.style.transform  = `translate(${r.x - 22}px, ${r.y - 29}px)`
      if (swingRef.current)
        swingRef.current.style.transform = `rotate(${swingAngle}deg)`

    } else if (p === 'spinning') {
      const m = mouseRef.current
      const r = robotRef.current
      r.x += (m.x - r.x) * 0.12
      r.y += (m.y + FOLLOW_DIST - r.y) * 0.12

      if (posRef.current)
        posRef.current.style.transform  = `translate(${r.x - 22}px, ${r.y - 29}px)`
      if (swingRef.current)
        swingRef.current.style.transform = 'rotate(0deg)'

    } else if (p === 'falling') {
      const f = fallRef.current

      f.vy    += GRAVITY
      f.vx    += (Math.random() - 0.5) * 0.28
      f.x     += f.vx
      f.y     += f.vy
      f.t     += 1

      const wobble = Math.sin(f.t * 0.22) * 9 + Math.cos(f.t * 0.13) * 4
      f.angle += wobble

      if (posRef.current)
        posRef.current.style.transform  = `translate(${f.x - 22}px, ${f.y - 29}px)`
      if (swingRef.current)
        swingRef.current.style.transform = 'rotate(0deg)'
      if (spinRef.current)
        spinRef.current.style.transform  = `rotate(${f.angle}deg)`

      if (f.y > window.innerHeight + 160) {
        phaseRef.current = 'hidden'
        setPhase('hidden')
        setMood('idle')
        setVisible(false)

        respawnTimer.current = setTimeout(() => {
          const m  = mouseRef.current
          const nx = m.x
          const ny = m.y + FOLLOW_DIST

          robotRef.current = { x: nx, y: ny }
          velRef.current   = { x: 0,  y: 0  }

          if (spinRef.current)  spinRef.current.style.transform  = ''
          if (swingRef.current) swingRef.current.style.transform = 'rotate(0deg)'
          if (posRef.current)   posRef.current.style.transform   =
            `translate(${nx - 22}px, ${ny - 29}px)`

          if (popRef.current) {
            popRef.current.style.animation =
              'rc-pop 0.48s cubic-bezier(0.34,1.56,0.64,1) forwards'
            popRef.current.addEventListener(
              'animationend',
              () => { if (popRef.current) popRef.current.style.animation = '' },
              { once: true },
            )
          }

          cooldownRef.current = true
          excitedRef.current  = false
          setTimeout(() => { cooldownRef.current = false }, 900)

          phaseRef.current = 'idle'
          setPhase('idle')
          setVisible(true)
        }, 2000)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    if (!mounted || isTouch) return

    const onDblClick = () => {
      dismissedRef.current = true
      phaseRef.current = 'hidden'
      setPhase('hidden')
      setVisible(false)
      if (respawnTimer.current) clearTimeout(respawnTimer.current)
    }

    const onMove = (e: MouseEvent) => {
      if (dismissedRef.current) return
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY

      if (phaseRef.current === 'idle') {
        setVisible(true)

        if (!cooldownRef.current) {
          const isOver = !!(e.target as Element).closest(INTERACTIVE)
          if (isOver && !excitedRef.current) {
            excitedRef.current  = true
            phaseRef.current    = 'spinning'
            setPhase('spinning')
            setMood('shocked')
          } else if (!isOver) {
            excitedRef.current = false
          }
        }
      }
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => { if (phaseRef.current === 'idle') setVisible(true) }

    document.addEventListener('mousemove',  onMove,     { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('dblclick',   onDblClick)

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove',  onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('dblclick',   onDblClick)
      if (rafRef.current)    cancelAnimationFrame(rafRef.current)
      if (respawnTimer.current) clearTimeout(respawnTimer.current)
    }
  }, [mounted, isTouch, tick])

  if (!mounted || isTouch) return null

  const glowClass =
    phase === 'spinning' ? 'rc-glow-excited' :
    phase === 'falling'  ? 'rc-glow-scared'  : ''

  return (
    <>
      <style>{`
        .rc-layer {
          position: fixed; inset: 0;
          pointer-events: none;
          z-index: 999999;
        }
        .rc-pos {
          position: absolute; top: 0; left: 0;
          will-change: transform;
        }
        .rc-swing {
          transform-origin: 22px 29px;
          will-change: transform;
        }
        .rc-glow { transition: filter 0.22s ease; }
        .rc-glow-excited {
          filter:
            drop-shadow(0 0  6px #4A6FE6)
            drop-shadow(0 0 18px rgba(74,111,230,0.80))
            drop-shadow(0 0 36px rgba(74,111,230,0.30));
        }
        .rc-glow-scared {
          animation: rc-panic-glow 0.26s ease-in-out infinite alternate;
        }
        @keyframes rc-panic-glow {
          from {
            filter:
              drop-shadow(0 0  5px #ff7c4d)
              drop-shadow(0 0 14px rgba(255,100,50,0.55));
          }
          to {
            filter:
              drop-shadow(0 0 14px #ff7c4d)
              drop-shadow(0 0 34px rgba(255,100,50,0.85))
              drop-shadow(0 0 60px rgba(255,60,20,0.30));
          }
        }
        .rc-spin3 {
          animation: rc-3spin 1.2s linear forwards;
        }
        @keyframes rc-3spin {
          from { transform: rotate(0deg);    }
          to   { transform: rotate(1080deg); }
        }
        @keyframes rc-pop {
          0%   { transform: scale(0)    rotate(-28deg); opacity: 0; }
          55%  { transform: scale(1.20) rotate(  7deg); opacity: 1; }
          75%  { transform: scale(0.90) rotate( -4deg); opacity: 1; }
          90%  { transform: scale(1.05) rotate(  2deg); opacity: 1; }
          100% { transform: scale(1)    rotate(  0deg); opacity: 1; }
        }
      `}</style>

      <div
        className="rc-layer"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.18s ease' }}
      >
        <div ref={posRef} className="rc-pos">
          <div ref={swingRef} className="rc-swing">
            <div ref={glowRef} className={`rc-glow ${glowClass}`}>
              <div
                ref={spinRef}
                className={phase === 'spinning' ? 'rc-spin3' : ''}
                onAnimationEnd={phase === 'spinning' ? handleSpinEnd : undefined}
              >
                <div ref={popRef}>
                  <RobotIcon mood={mood} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
