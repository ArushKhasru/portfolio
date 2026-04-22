import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'

const personalDetails = {
  name: 'Arush Khasru',
  nationality: 'Indian',
  email: 'arushku23@gmail.com',
  github: 'https://github.com/ArushKhasru',
  githubLabel: 'github.com/ArushKhasru',
  linkedin: 'https://linkedin.com/in/arush-khasru',
  linkedinLabel: 'linkedin.com/in/arush-khasru',
}

const contactProfiles = [
  {
    key: 'github',
    label: 'GitHub',
    href: personalDetails.github,
    display: personalDetails.githubLabel,
    icon: 'github',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    href: personalDetails.linkedin,
    display: personalDetails.linkedinLabel,
    icon: 'linkedin',
  },
  {
    key: 'email',
    label: 'Gmail',
    href: `mailto:${personalDetails.email}`,
    display: personalDetails.email,
    icon: 'gmail',
  },
]

const education = [
  {
    degree: 'Master of Computer Applications (MCA)',
    timeline: '2024 - Present',
    institute: 'Central University of Himachal Pradesh',
    notes: '',
  },
  {
    degree: 'B.Sc. (Physics, Computer Science, Mathematics)',
    timeline: '2021 - 2024',
    institute: 'Govt. PG College, Una (Affiliated to HPU Shimla)',
    notes: 'CGPA: 6.21/10',
  },
]

const examsQualified = [
  {
    name: 'UGC NET (Computer Science)',
    session: 'December 2025',
    detail: 'Eligible for Assistant Professor and PhD Admission',
  },
]

const projects = [
  {
    name: 'BakBak 2.0',
    stack: 'Next.js 16 | React 19',
    description:
      'Real-time community and direct-messaging platform built with Clerk authentication, Stream Chat, and Tailwind CSS.',
    demoUrl: 'https://bak-bak-2-0.vercel.app',
  },
  {
    name: 'CUHP Devs',
    stack: 'Next.js | Express | Socket.IO',
    description:
      'Student developer community and coding-practice platform built as a Turborepo monorepo with MongoDB.',
    demoUrl: 'http://cuhp-devs-web.vercel.app/',
  },
  {
    name: 'OpenEnv Bug Triage',
    stack: 'Python | FastAPI',
    description:
      'Bug triage environment with Pydantic models, ticket classification, duplicate detection, and escalation workflows.',
    demoUrl: 'https://huggingface.co/spaces/TheOnlyKaks/my-env',
  },
  {
    name: 'Socratic AI',
    stack: 'TypeScript | AI Chat',
    description:
      'An intelligent chat-based learning app that uses guided questioning (Socratic method) instead of direct answers.',
    demoUrl: 'https://socratic-ai-web-one.vercel.app/',
  },
]

const skillGroups = [
  {
    title: 'Programming Languages',
    values: ['Python', 'JavaScript', 'SQL', 'HTML', 'CSS', 'C'],
  },
  {
    title: 'Frontend',
    values: ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'Redux'],
  },
  {
    title: 'Backend',
    values: ['Node.js', 'Express', 'Socket.IO','WebSocket', 'FastAPI', 'Mongoose'],
  },
  {
    title: 'Databases',
    values: ['MongoDB', 'MySQL'],
  },
  {
    title: 'Tools',
    values: ['Git', 'GitHub', 'Figma', 'Postman', 'npm'],
  },
  {
    title: 'Core Concepts',
    values: ['REST APIs', 'JWT Authentication', 'Real-Time Systems', 'OOP', 'DSA'],
  },
]

const navLinks = [
  { label: 'About', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Skills', href: '/skills' },
  { label: 'Education', href: '/education' },
]

function normalizePath(pathname) {
  const validPaths = navLinks.map((item) => item.href)

  if (pathname === '/about') {
    return '/'
  }

  return validPaths.includes(pathname) ? pathname : '/'
}

function getInitialTheme() {
  if (typeof window === 'undefined') {
    return true
  }

  if (document.documentElement.dataset.theme) {
    return document.documentElement.dataset.theme === 'dark'
  }

  const savedTheme = window.localStorage.getItem('portfolio-theme')
  if (savedTheme === 'light') {
    return false
  }
  if (savedTheme === 'dark') {
    return true
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function StartupLoader({ isDark, onComplete }) {
  const loaderName = 'ARUSH_KHASRU'
  const [typedName, setTypedName] = useState('')
  const [lineProgress, setLineProgress] = useState(0)
  const hasCompletedRef = useRef(false)
  const TYPE_DELAY_MS = 100
  const LINE_PROGRESS_DELAY_MS = 80
  const FINAL_HOLD_MS = 600

  useEffect(() => {
    let timer = undefined

    if (typedName.length < loaderName.length) {
      timer = window.setTimeout(() => {
        setTypedName(loaderName.slice(0, typedName.length + 1))
      }, TYPE_DELAY_MS)
    } else if (lineProgress < 100) {
      timer = window.setTimeout(() => {
        setLineProgress((current) => Math.min(current + 8, 100))
      }, LINE_PROGRESS_DELAY_MS)
    } else if (!hasCompletedRef.current) {
      hasCompletedRef.current = true
      timer = window.setTimeout(() => {
        onComplete()
      }, FINAL_HOLD_MS)
    }

    return () => window.clearTimeout(timer)
  }, [typedName, lineProgress, onComplete, loaderName.length])

  return (
    <section
      className={`startup-loader ${isDark ? 'startup-loader--dark' : 'startup-loader--light'}`}
      aria-label="Loading portfolio"
    >
      <div className="startup-loader__content">
        <p className="startup-loader__name">
          <span className="startup-loader__typed">{typedName}</span>
          {typedName.length < loaderName.length && (
            <span aria-hidden="true" className="startup-loader__caret">
              _
            </span>
          )}
        </p>
        <div className="startup-loader__line-loader mt-8" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={lineProgress}>
          <span className="startup-loader__line-loader-fill" style={{ width: `${lineProgress}%` }}></span>
        </div>
      </div>
    </section>
  )
}

function AKLogo({ onOpenAbout, isDark }) {
  return (
    <button
      type="button"
      onClick={onOpenAbout}
      className={`logo-node relative flex h-[84px] w-[58px] items-center justify-center overflow-hidden rounded-xl ${isDark ? 'cyber-glitch' : ''}`}
      aria-label="Go to About section"
      title="About"
    >
      <span aria-hidden="true" className="logo-node__pulse absolute inset-0"></span>
        <svg aria-hidden="true" focusable="false" viewBox="0 0 272 480" xmlns="http://www.w3.org/2000/svg">
    <title>AK Monogram</title>
    <path fill={isDark ? "#00ff41" : "#cdffb8"} d="M62 417V123L90 107V401ZM128 382V123L156 107V366ZM88 295V253L116 237V279ZM192 417V123L220 107V401ZM220 221 250 132 272 120 242
  209ZM220 278 250 366 272 354 242 265Z"/>
    <path fill={isDark ? "#00cc33" : "#d482ab"} d="M22 146 62 123 90 107 50 130ZM88 146 128 123 156 107 116 130ZM62 268 88 253 116 237 90 252ZM152 146 192 123 220 107 180 130ZM222
  149 250 132 272 120 244 136ZM192 262 220 278 244 264 216 248Z"/>
    <path fill={isDark ? "#009926" : "#2abc89"} d="M22 440 62 417V123L22 146ZM88 405 128 382V123L88 146ZM62 310 88 295V253L62 268ZM152 440 192 417V123L152 146ZM192 237 220 221 250
  132 222 149ZM192 262 220 278 250 366 222 350Z"/>
  </svg>
    </button>
  )
}

function ContactBrandIcon({ brand, className = 'h-[18px] w-[18px]' }) {
  if (brand === 'github') {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
      </svg>
    )
  }

  if (brand === 'linkedin') {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zM4.943 13.394V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248m4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025H8.84l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
  )
}

function TerminalPanel({ onNavigate, activePath, isDark }) {
  const routeNames = navLinks.map((item) => (item.href === '/' ? 'about' : item.href.replace('/', '')))
  const activeRoute = activePath === '/' ? 'about' : activePath.replace('/', '')
  const promptPrefix = `arush@portfolio:${activeRoute}`
  const scrollRef = useRef(null)
  const [entries, setEntries] = useState([
    { kind: 'output', tone: 'normal', text: `Welcome to /portfolio/${activeRoute}` },
    {
      kind: 'output',
      tone: 'normal',
      text: "Type 'help' to see available commands and quick navigation options.",
    },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef(null)

  useEffect(() => {
    const node = scrollRef.current
    if (!node) {
      return
    }
    node.scrollTop = node.scrollHeight
  }, [entries])

  const appendOutput = (text, href, tone = 'normal') => {
    setEntries((current) => [...current, { kind: 'output', text, href, tone }])
  }

  const appendError = (text) => {
    appendOutput(text, undefined, 'error')
  }

  const openExternalLink = (href) => {
    if (href.startsWith('mailto:')) {
      window.location.href = href
      return
    }
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  const runCommand = (rawCommand) => {
    const command = rawCommand.trim()
    const normalized = command.toLowerCase()

    if (!command) {
      return
    }

    setEntries((current) => [...current, { kind: 'command', text: command }])

    if (normalized === 'clear') {
      setEntries([])
      return
    }

    if (normalized === 'help') {
      appendOutput(
        `help                         - show available commands
whoami                       - about current user
pwd                          - print current route
ls portfolio/                - list sections
open [section]               - navigate to a section
contact [links]              - open contact links
portfolio --status           - show terminal status
clear                        - clear the terminal
Up Arrow                     - previous command
Down Arrow                   - next command`,
      )
      return
    }

    if (normalized === 'whoami') {
      appendOutput('arush_khasru - MCA student, full-stack developer, UGC NET (CS) qualified.')
      return
    }

    if (normalized === 'cat qualification.txt') {
      appendOutput('UGC NET (Computer Science), December 2025.')
      return
    }

    if (
      normalized === 'ls tech_stack' ||
      normalized === 'ls core_stack' ||
      normalized === 'ls'
    ) {
      appendOutput('#python #javascript #nextjs #fastapi #socketio')
      return
    }

    if (normalized === 'pwd') {
      appendOutput(`/portfolio/${activeRoute}`)
      return
    }

    if (normalized === 'ls portfolio' || normalized === 'ls portfolio/') {
      appendOutput('about projects skills education')
      return
    }

    if (normalized.startsWith('open ')) {
      const target = normalized.replace('open ', '').trim()
      if (routeNames.includes(target)) {
        const routePath = target === 'about' ? '/' : `/${target}`
        onNavigate(routePath)
        appendOutput(`Opening ${routePath}...`)
      } else {
        appendError(`Unknown route: ${target}. Try: open projects`)
      }
      return
    }

    if (normalized === 'contact') {
      appendOutput(`GitHub: ${personalDetails.githubLabel}`, personalDetails.github)
      appendOutput(`LinkedIn: ${personalDetails.linkedinLabel}`, personalDetails.linkedin)
      appendOutput(`Email: ${personalDetails.email}`, `mailto:${personalDetails.email}`)
      return
    }

    if (normalized === 'contact github') {
      appendOutput(personalDetails.githubLabel, personalDetails.github)
      openExternalLink(personalDetails.github)
      return
    }

    if (normalized === 'contact linkedin') {
      appendOutput(personalDetails.linkedinLabel, personalDetails.linkedin)
      openExternalLink(personalDetails.linkedin)
      return
    }

    if (normalized === 'contact email') {
      appendOutput(personalDetails.email, `mailto:${personalDetails.email}`)
      openExternalLink(`mailto:${personalDetails.email}`)
      return
    }

    if (normalized === 'portfolio --status') {
      appendOutput(
        `status=online, route=${activePath}, theme=${isDark ? 'dark' : 'light'}, uptime=stable`,
      )
      return
    }

    appendError(`Command not found: ${command}. Run 'help' to see available commands.`)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const command = input.trim()
    if (!command) {
      return
    }

    setHistory((current) => [command, ...current.slice(0, 49)])
    setHistoryIndex(-1)
    runCommand(command)
    setInput('')
    window.requestAnimationFrame(() => inputRef.current?.focus())
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!history.length) {
        return
      }
      const nextIndex = Math.min(historyIndex + 1, history.length - 1)
      setHistoryIndex(nextIndex)
      setInput(history[nextIndex])
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!history.length) {
        return
      }
      const nextIndex = historyIndex - 1
      if (nextIndex < 0) {
        setHistoryIndex(-1)
        setInput('')
        return
      }
      setHistoryIndex(nextIndex)
      setInput(history[nextIndex])
    }
  }

  return (
    <section className="space-y-4">
      <div className="terminal-shell flex h-[420px] flex-col overflow-hidden border border-white/15 bg-surface-container-lowest">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56]"></div>
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="h-3 w-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <div className="font-code-md text-xs text-on-surface-variant/50">
            portfolio.zsh - interactive
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-6 font-code-md text-sm leading-relaxed text-primary">
          <div
            ref={scrollRef}
            className="terminal-scrollbar-none min-h-0 flex-1 space-y-2 overflow-y-auto pr-1"
          >
            {entries.map((entry, index) => (
              <div key={`${entry.kind}-${index}`} className="terminal-line flex gap-3">
                {entry.kind === 'command' ? (
                  <>
                    <span className="terminal-prompt">{promptPrefix}$</span>
                    <span>{entry.text}</span>
                  </>
                ) : (
                  <>
                    <span className={entry.tone === 'error' ? 'terminal-marker-error' : 'terminal-marker'}>
                      {'>'}
                    </span>
                    {entry.href ? (
                      <a
                        href={entry.href}
                        target={entry.href.startsWith('mailto:') ? undefined : '_blank'}
                        rel={entry.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                        className="terminal-output-link underline decoration-dotted"
                      >
                        {entry.text}
                      </a>
                    ) : (
                      <span
                        className={`whitespace-pre-wrap ${
                          entry.tone === 'error' ? 'terminal-output-error' : 'terminal-output'
                        }`}
                      >
                        {entry.text}
                      </span>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-3">
            <span className="terminal-prompt">{promptPrefix}$</span>
            <div className="relative flex-1">
              <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              className="terminal-input w-full bg-transparent text-on-surface placeholder:text-on-surface-variant/60 outline-none"
              autoComplete="off"
              spellCheck={false}
            />
              {isDark && input === '' && (
                <span className="absolute left-0 top-1/2 h-4 w-2 -translate-y-1/2 animate-[loader-caret-blink_1s_infinite] bg-primary/60"></span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

function AboutRoute({ onNavigate, activePath, isDark }) {
  return (
    <>
      <section className="space-y-6">
        <h1 className="font-headline-xl text-headline-xl text-on-surface">
          Hello, World..!
        </h1>
        <p className="max-w-2xl font-code-md text-body-lg text-on-surface-variant">
          I am an MCA student and builder focused on real-time systems, full-stack
          JavaScript products, and practical developer communities. I recently
          qualified UGC NET (Computer Science), December 2025.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="/Arush_CV.pdf"
            className="action-btn action-btn-primary"
          >
            <span className="material-symbols-outlined text-base" aria-hidden="true">
              download
            </span>
            Download CV
          </a>
          <a
            href={`mailto:${personalDetails.email}`}
            className="action-btn action-btn-ghost"
          >
            <span className="material-symbols-outlined text-base" aria-hidden="true">
              mail
            </span>
            Contact Me
          </a>
        </div>
      </section>

      <TerminalPanel onNavigate={onNavigate} activePath={activePath} isDark={isDark} />
    </>
  )
}

function ProjectsRoute() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-headline-md text-headline-md text-on-surface">
          <span className="material-symbols-outlined text-primary" aria-hidden="true">
            bookmark
          </span>
          Major Projects
        </h2>
      </div>
      <div className="space-y-4">
        {projects.map((project) => (
          <a
            key={project.name}
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.name} live demo`}
            title={`Open ${project.name} live demo`}
            className="lift-on-hover group flex cursor-pointer items-start justify-between gap-4 border border-white/10 p-4 transition-colors hover:border-primary/50"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="font-headline-md text-body-lg text-on-surface">{project.name}</h3>
                <span className="border border-primary/30 px-1.5 py-0.5 font-code-md text-[10px] text-primary">
                  {project.stack}
                </span>
              </div>
              <p className="text-body-md text-on-surface-variant">{project.description}</p>
            </div>
            <span className="interactive-press inline-flex items-center text-primary hover:text-[#86efac]">
              <span className="material-symbols-outlined text-lg leading-none" aria-hidden="true">
                arrow_outward
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}

function SkillsRoute() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-headline-md text-headline-md text-on-surface">
          <span className="material-symbols-outlined text-primary" aria-hidden="true">
            engineering
          </span>
          Skills
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {skillGroups.map((group) => (
          <article key={group.title} className="lift-on-hover border border-white/10 p-4">
            <h3 className="mb-3 font-headline-md text-body-md text-primary">{group.title}</h3>
            <ul className="space-y-2">
              {group.values.map((value) => (
                <li key={value} className="font-code-md text-sm text-on-surface-variant">
                  {value}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

function EducationRoute() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-headline-md text-headline-md text-on-surface">
          <span className="material-symbols-outlined text-primary" aria-hidden="true">
            school
          </span>
          Educational Qualifications
        </h2>
      </div>
      <div className="space-y-4">
        {education.map((item) => (
          <article key={item.degree} className="lift-on-hover border border-white/10 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="font-headline-md text-body-lg text-on-surface">{item.degree}</h3>
              <span className="font-code-md text-xs text-on-surface-variant/60">{item.timeline}</span>
            </div>
            <p className="mt-2 text-body-md text-on-surface-variant">{item.institute}</p>
            {item.notes && <p className="mt-1 font-code-md text-sm text-primary">{item.notes}</p>}
          </article>
        ))}
      </div>
      <article className="rounded-xl border border-primary/30 bg-primary/5 p-4">
        <h3 className="font-headline-md text-body-md text-primary">Exams Qualified</h3>
        <ul className="mt-2 space-y-2">
          {examsQualified.map((exam) => (
            <li key={exam.name} className="text-body-md text-on-surface-variant">
              <span className="font-medium text-on-surface">{exam.name}</span> ({exam.session}) -{' '}
              {exam.detail}
            </li>
          ))}
        </ul>
      </article>
    </section>
  )
}

function App() {
  const [isDark, setIsDark] = useState(getInitialTheme)
  const [showStartupLoader, setShowStartupLoader] = useState(true)
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window === 'undefined') {
      return '/'
    }
    return normalizePath(window.location.pathname)
  })

  useEffect(() => {
    const normalized = normalizePath(window.location.pathname)
    if (normalized !== window.location.pathname) {
      window.history.replaceState({}, '', normalized)
    }

    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
    window.localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('portfolio-theme')
    if (savedTheme) {
      return undefined
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleThemeChange = (event) => setIsDark(event.matches)

    mediaQuery.addEventListener('change', handleThemeChange)
    return () => mediaQuery.removeEventListener('change', handleThemeChange)
  }, [])

  const navigate = (path) => {
    const normalized = normalizePath(path)
    if (normalized === currentPath) {
      return
    }
    window.history.pushState({}, '', normalized)
    setCurrentPath(normalized)
  }

  const handleStartupComplete = useCallback(() => {
    setShowStartupLoader(false)
  }, [])

  if (showStartupLoader) {
    return <StartupLoader isDark={isDark} onComplete={handleStartupComplete} />
  }

  return (
    <div className={`app-shell flex min-h-screen flex-col bg-background text-on-background selection:bg-primary selection:text-on-primary ${isDark ? 'cyber-grid' : ''}`}>
      {isDark && <div className="cyber-scanline" aria-hidden="true" />}
      <header className="full-width bg-transparent">
        <nav className="mx-auto flex max-w-[900px] items-center justify-between gap-6 px-6 py-5 font-['Space_Grotesk']">
          <div className="flex min-w-0 items-center gap-4">
            <div className="hidden sm:block">
              <AKLogo onOpenAbout={() => navigate('/')} isDark={isDark} />
            </div>
            <div className="min-w-0">
              <p
                className={`truncate text-2xl font-bold tracking-tight sm:text-[1.85rem] animate-pulse-subtle ${
                  isDark ? 'text-[#e5e7eb]' : 'text-slate-800'
                }`}
              >
                Arush Khasru
                <span className="ml-1 inline-block h-[0.8em] w-[8px] bg-primary/60 align-middle animate-[loader-caret-blink_1s_infinite]"></span>
              </p>
              <div className="mt-2 hidden items-center text-base font-semibold md:flex">
                {navLinks.map((link, index) => {
                  const isActive = currentPath === link.href
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(event) => {
                        event.preventDefault()
                        navigate(link.href)
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      data-active={isActive}
                      className={`route-link transition-colors ${
                        isDark
                          ? isActive
                            ? 'text-[#86efac]'
                            : 'text-[#4ade80] hover:text-[#86efac]'
                          : isActive
                            ? 'text-emerald-700'
                            : 'text-emerald-600 hover:text-emerald-700'
                      } ${
                        index !== navLinks.length - 1
                          ? isDark
                            ? 'mr-4 border-r border-[#22c55e]/70 pr-4'
                            : 'mr-4 border-r border-emerald-500/70 pr-4'
                          : ''
                      }`}
                    >
                      {link.label}
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {contactProfiles.map((contact) => (
              <a
                key={contact.key}
                href={contact.href}
                target={contact.key === 'email' ? undefined : '_blank'}
                rel={contact.key === 'email' ? undefined : 'noreferrer'}
                className={`contact-chip inline-flex items-center rounded-full p-2 text-sm ${
                  isDark
                    ? 'text-slate-300 hover:bg-[#2b3a4f] hover:text-[#f8fafc]'
                    : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
                title={`${contact.label}: ${contact.display}`}
                aria-label={`${contact.label}: ${contact.display}`}
              >
                <ContactBrandIcon brand={contact.icon} />
              </a>
            ))}
            <button
              type="button"
              className={`theme-toggle rounded-full p-2 transition-all ${
                isDark
                  ? 'text-slate-300 hover:bg-[#2b3a4f] hover:text-[#f8fafc]'
                  : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
              aria-label="Toggle theme"
              aria-pressed={isDark}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => setIsDark((previous) => !previous)}
            >
              <span
                className={`material-symbols-outlined transition-transform duration-300 ${
                  isDark ? 'rotate-0' : 'rotate-180'
                }`}
                aria-hidden="true"
              >
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>
        </nav>
        <div className="mx-auto flex max-w-[900px] flex-wrap items-center px-6 pb-4 text-[13px] font-semibold md:hidden">
          {navLinks.map((link, index) => {
            const isActive = currentPath === link.href
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(event) => {
                  event.preventDefault()
                  navigate(link.href)
                }}
                aria-current={isActive ? 'page' : undefined}
                data-active={isActive}
                className={`route-link transition-colors ${
                  isDark
                    ? isActive
                      ? 'text-[#86efac]'
                      : 'text-[#4ade80] hover:text-[#86efac]'
                    : isActive
                      ? 'text-emerald-700'
                      : 'text-emerald-600 hover:text-emerald-700'
                } ${
                  index !== navLinks.length - 1
                    ? isDark
                      ? 'mr-3 border-r border-[#22c55e]/70 pr-3'
                      : 'mr-3 border-r border-emerald-500/70 pr-3'
                    : ''
                }`}
              >
                {link.label}
              </a>
            )
          })}
        </div>
      </header>

      <main className="mx-auto w-full max-w-[800px] flex-1 px-6 py-10">
        <div key={currentPath} className="route-stage space-y-16">
          {currentPath === '/' && (
            <AboutRoute onNavigate={navigate} activePath={currentPath} isDark={isDark} />
          )}
          {currentPath === '/projects' && <ProjectsRoute />}
          {currentPath === '/skills' && <SkillsRoute />}
          {currentPath === '/education' && <EducationRoute />}
        </div>
      </main>

      <footer className="full-width py-4 text-center">
        <div
          className={`mx-auto max-w-[800px] px-6 text-center font-mono text-xs uppercase tracking-widest ${
            isDark ? 'text-[#4ade80]' : 'text-emerald-700'
          }`}
        >
          © arushkhasru.me | 2026
        </div>
      </footer>
    </div>
  )
}

export default App

