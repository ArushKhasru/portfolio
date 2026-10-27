import { useEffect, useRef, useState } from 'react'
import './PortfolioIntro.css'

export default function PortfolioIntro({ onComplete }) {
  const videoRef = useRef(null)
  const skipRef = useRef(null)
  const hasPlayedRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [portrait] = useState(() => window.matchMedia('(max-aspect-ratio: 3/4)').matches)
  const suffix = portrait ? '-portrait' : ''

  useEffect(() => {
    const video = videoRef.current
    skipRef.current?.focus({ preventScroll: true })
    const timeout = window.setTimeout(() => {
      if (!hasPlayedRef.current) onComplete()
    }, 9000)
    const handleEscape = event => {
      if (event.key === 'Escape') onComplete()
    }
    const handleVisibility = () => {
      if (document.hidden && !video.paused) video.pause()
    }
    video.play().catch(() => {
      // A visible Play button is available when a browser blocks autoplay.
    })
    window.addEventListener('keydown', handleEscape)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.clearTimeout(timeout)
      window.removeEventListener('keydown', handleEscape)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [onComplete])

  const togglePlayback = () => {
    const video = videoRef.current
    if (video.paused) video.play().catch(onComplete)
    else video.pause()
  }

  return (
    <section className="intro-film" aria-label="Arush Khasru portfolio introduction">
      <video
        ref={videoRef}
        className="intro-film__video"
        src={`/video/arush-intro${suffix}.mp4`}
        poster={`/video/arush-intro${suffix}-poster.jpg`}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-label="25-second introduction: Arush Khasru, AI and full-stack developer, selected projects, and skills"
        onPlaying={() => { hasPlayedRef.current = true; setIsPlaying(true) }}
        onPause={() => setIsPlaying(false)}
        onEnded={onComplete}
        onError={onComplete}
      />
      <div className="intro-film__controls">
        <button className="intro-film__control" type="button" onClick={togglePlayback} aria-label={isPlaying ? 'Pause introduction' : 'Play introduction'}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            {isPlaying ? <path d="M6 4v12M14 4v12" /> : <path d="m6 4 10 6-10 6Z" />}
          </svg>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <a className="intro-film__control" href="/video/arush-intro.mp4" download="Arush-Khasru-Intro.mp4">Download MP4</a>
        <button ref={skipRef} className="intro-film__control intro-film__control--skip" type="button" onClick={onComplete}>
          Skip intro
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 5 6 5-6 5M15 5v10" /></svg>
        </button>
      </div>
      <p className="intro-film__transcript">
        Arush Khasru. AI and full-stack developer. AI Trainer at Handshake AI.
        Selected projects: perky, a workspace launcher and AI assistant; Socratic AI,
        a guided learning platform; OpenEnv Bug Triage, an AI evaluation environment.
        Skills: React, Next.js, Node.js, FastAPI, Python, JavaScript, SQL, Git,
        Codex, Claude Code, and Gemini CLI. Explore arushkhasru.me.
      </p>
    </section>
  )
}
