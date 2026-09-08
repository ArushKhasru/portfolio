import { useEffect, useRef } from 'react'

// Fixed coordinates keep the sky stable across renders and route changes.
const stars = Array.from({ length: 180 }, (_, index) => ({
  x: ((index * 137.508 + 37) % 1600).toFixed(2),
  y: ((index * index * 17.31 + index * 71.7 + 23) % 1000).toFixed(2),
  radius: index % 13 === 0 ? 1.6 : index % 3 === 0 ? 1 : 0.65,
  opacity: 0.2 + ((index * 7) % 10) * 0.055,
}))

export default function Starfield() {
  const fieldRef = useRef(null)
  const driftRef = useRef(null)

  useEffect(() => {
    const field = fieldRef.current
    const drift = driftRef.current
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointerPreference = window.matchMedia('(hover: hover) and (pointer: fine)')
    let frame = 0
    let previousTime = 0
    let x = 0
    let y = 0
    let targetX = 0
    let targetY = 0

    const paint = () => {
      drift.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
    }
    const animate = (time) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16
      previousTime = time
      const ease = 1 - Math.exp(-elapsed / 140)
      x += (targetX - x) * ease
      y += (targetY - y) * ease
      if (Math.abs(targetX - x) + Math.abs(targetY - y) < 0.05) {
        x = targetX
        y = targetY
        frame = 0
        previousTime = 0
      } else {
        frame = window.requestAnimationFrame(animate)
      }
      paint()
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(animate)
    }
    const reset = () => {
      targetX = 0
      targetY = 0
      schedule()
    }
    const syncPreferences = () => {
      field.dataset.paused = String(document.hidden)
      window.cancelAnimationFrame(frame)
      frame = 0
      previousTime = 0
      x = y = targetX = targetY = 0
      paint()
    }
    const followPointer = (event) => {
      if (motionPreference.matches || !pointerPreference.matches || document.hidden || event.pointerType === 'touch') return
      targetX = (event.clientX / window.innerWidth - 0.5) * 48
      targetY = (event.clientY / window.innerHeight - 0.5) * 36
      schedule()
    }

    syncPreferences()
    window.addEventListener('pointermove', followPointer, { passive: true })
    document.documentElement.addEventListener('pointerleave', reset)
    window.addEventListener('blur', reset)
    document.addEventListener('visibilitychange', syncPreferences)
    motionPreference.addEventListener('change', syncPreferences)
    pointerPreference.addEventListener('change', syncPreferences)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', followPointer)
      document.documentElement.removeEventListener('pointerleave', reset)
      window.removeEventListener('blur', reset)
      document.removeEventListener('visibilitychange', syncPreferences)
      motionPreference.removeEventListener('change', syncPreferences)
      pointerPreference.removeEventListener('change', syncPreferences)
    }
  }, [])

  return (
    <div ref={fieldRef} className="starfield" aria-hidden="true">
      <div ref={driftRef} className="starfield__drift">
      <svg className="starfield__sky" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <radialGradient id="starlight">
            <stop offset="0%" stopColor="#e4efff" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#b9d5ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {stars.map((star, index) => (
          <g key={index} className="starfield__twinkle" style={{ animationDelay: `${-(index * 0.73) % 9}s`, animationDuration: `${3.5 + (index % 8) * 0.6}s` }}>
            {index % 13 === 0 && <circle cx={star.x} cy={star.y} r="8" fill="url(#starlight)" />}
            <circle cx={star.x} cy={star.y} r={star.radius} fill="#dbe7f7" opacity={star.opacity} />
          </g>
        ))}
      </svg>
      </div>
    </div>
  )
}
