import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import DecorativeVines from './assets/components/DecorativeVines'

const personalDetails = {
  name: 'Arush Khasru',
  nationality: 'Indian',
  email: 'contact@arushkhasru.me',
  github: 'https://github.com/ArushKhasru',
  githubLabel: 'github.com/ArushKhasru',
  githubUsername: 'ArushKhasru',
  linkedin: 'https://linkedin.com/in/arush-khasru',
  linkedinLabel: 'linkedin.com/in/arush-khasru',
  x: 'https://x.com/khasruaru',
  xLabel: 'x.com/khasruaru',
}

const GITHUB_PULL_REQUESTS_CACHE_KEY = 'portfolio-github-open-source-pull-requests'
const GITHUB_PULL_REQUESTS_CACHE_MAX_AGE_MS = 5 * 60 * 1000
const GITHUB_PULL_REQUESTS_PER_PAGE = 100
const GITHUB_PULL_REQUESTS_MAX_PAGES = 10

const defaultGithubPullRequestData = {
  repositories: [],
  totalCount: 0,
  fetchedCount: 0,
  updatedAt: undefined,
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
    key: 'x',
    label: 'X',
    href: personalDetails.x,
    display: personalDetails.xLabel,
    icon: 'x',
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
  },
]

const examsQualified = [
  {
    name: 'UGC NET (Computer Science)',
    timeline: 'DEC - 2025',
    detail: 'Eligible for Assistant Professor and PhD Admission',
  },
]

const projects = [
  {
    name: 'perky',
    stack: 'Node.js | Commander | AI',
    description:
      'A CLI workspace launcher and AI assistant for developers. Simplifies managing local development services and provides terminal-based Q&A and code explanations using Gemini and OpenAI.',
    demoUrl: 'https://www.npmjs.com/package/perky',
    githubUrl: 'https://github.com/ArushKhasru/perky',
  },
  {
    name: 'BakBak 2.0',
    stack: 'Next.js 16 | React 19',
    description:
      'Real-time community and direct-messaging platform built with Clerk authentication, Stream Chat, and Tailwind CSS.',
    demoUrl: 'https://bak-bak-2-0.vercel.app',
    githubUrl: 'https://github.com/ArushKhasru/BakBak-2.0',
  },
  {
    name: 'CUHP Devs',
    stack: 'Next.js | Express | Socket.IO',
    description:
      'Student developer community and coding-practice platform built as a Turborepo monorepo with MongoDB.',
    demoUrl: 'http://cuhp-devs-web.vercel.app/',
    githubUrl: 'https://github.com/ArushKhasru/cuhp-devs',
  },
  {
    name: 'OpenEnv Bug Triage',
    stack: 'Python | FastAPI',
    description:
      'Bug triage environment with Pydantic models, ticket classification, duplicate detection, and escalation workflows.',
    demoUrl: 'https://huggingface.co/spaces/TheOnlyKaks/my-env',
    githubUrl: 'https://github.com/ArushKhasru/openenv_bug_triage',
  },
  {
    name: 'Socratic AI',
    stack: 'TypeScript | AI Chat',
    description:
      'An intelligent chat-based learning app that uses guided questioning (Socratic method) instead of direct answers.',
    demoUrl: 'https://socratic-ai-web-one.vercel.app/',
    githubUrl: 'https://github.com/ArushKhasru/Socratic_AI',
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
    values: ['Node.js', 'Express', 'Socket.IO', 'WebSocket', 'FastAPI', 'Mongoose'],
  },
  {
    title: 'Databases',
    values: ['MongoDB', 'MySQL'],
  },
  {
    title: 'Cloud & Deployment',
    values: ['Vercel', 'Render', 'AWS EC2', 'Hugging Face Spaces'],
  },
  {
    title: 'Developer Tools',
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
  { label: 'Open Source', href: '/open-source' },
  { label: 'Skills', href: '/skills' },
  { label: 'Education', href: '/education' },
]

function normalizePath(pathname) {
  const validPaths = navLinks.map((item) => item.href)

  if (pathname === '/about') {
    return '/'
  }

  if (pathname === '/open-prs') {
    return '/open-source'
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

function getInitialLoaderVisibility() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.sessionStorage.getItem('portfolio-intro-seen') !== 'true'
}

function formatGithubCount(value) {
  return typeof value === 'number' ? new Intl.NumberFormat('en').format(value) : '--'
}

function getCachedGithubPullRequests() {
  if (typeof window === 'undefined') {
    return undefined
  }

  try {
    const cachedPullRequests = window.sessionStorage.getItem(GITHUB_PULL_REQUESTS_CACHE_KEY)
    if (!cachedPullRequests) {
      return undefined
    }

    const parsedPullRequests = JSON.parse(cachedPullRequests)
    if (Date.now() - parsedPullRequests.cachedAt > GITHUB_PULL_REQUESTS_CACHE_MAX_AGE_MS) {
      return undefined
    }

    return parsedPullRequests.data
  } catch {
    return undefined
  }
}

function cacheGithubPullRequests(data) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.sessionStorage.setItem(
      GITHUB_PULL_REQUESTS_CACHE_KEY,
      JSON.stringify({ cachedAt: Date.now(), data }),
    )
  } catch {
    // Pull request cards are still usable without session storage.
  }
}

function createGithubPullRequestSearchQuery() {
  return `is:pr author:${personalDetails.githubUsername} -user:${personalDetails.githubUsername}`
}

function createGithubPullRequestSearchUrl() {
  return `https://github.com/search?q=${encodeURIComponent(
    createGithubPullRequestSearchQuery(),
  )}&type=pullrequests`
}

function parseGithubRepositoryName(item) {
  const apiPrefix = 'https://api.github.com/repos/'
  if (item.repository_url?.startsWith(apiPrefix)) {
    return item.repository_url.slice(apiPrefix.length)
  }

  const repositoryUrlMatch = item.html_url?.match(/github\.com\/([^/]+\/[^/]+)\/pull\//)
  return repositoryUrlMatch?.[1] ?? 'Unknown repository'
}

function getGithubRepositoryUrl(fullName) {
  return fullName.includes('/') ? `https://github.com/${fullName}` : personalDetails.github
}

function getGithubPullRequestStatus(item) {
  if (item.pull_request?.merged_at) {
    return { key: 'merged', label: 'Merged' }
  }

  if (item.state === 'open') {
    return { key: 'open', label: 'Open' }
  }

  return { key: 'closed', label: 'Closed' }
}

function formatGithubDate(value) {
  if (!value) {
    return 'Unknown'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function groupGithubPullRequestsByRepository(items, totalCount) {
  const repositoriesByName = new Map()

  const filteredItems = items.filter((item) => {
    const repoFullName = parseGithubRepositoryName(item)
    const [, repoName = repoFullName] = repoFullName.split('/')
    return repoName !== 'cuhp-devs' && repoName !== 'agency-ai'
  })

  filteredItems.forEach((item) => {
    const repoFullName = parseGithubRepositoryName(item)
    const [owner = '', repoName = repoFullName] = repoFullName.split('/')
    const status = getGithubPullRequestStatus(item)
    const pullRequest = {
      id: item.id,
      title: item.title,
      number: item.number,
      url: item.html_url,
      repoFullName,
      statusKey: status.key,
      statusLabel: status.label,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      labels: Array.isArray(item.labels)
        ? item.labels.map((label) => label.name).filter(Boolean).slice(0, 3)
        : [],
    }

    const existingRepository = repositoriesByName.get(repoFullName)
    const repository = existingRepository ?? {
      fullName: repoFullName,
      owner,
      name: repoName,
      url: getGithubRepositoryUrl(repoFullName),
      pullRequests: [],
      openCount: 0,
      mergedCount: 0,
      closedCount: 0,
      latestUpdatedAt: pullRequest.updatedAt,
    }

    repository.pullRequests.push(pullRequest)
    repository.openCount += status.key === 'open' ? 1 : 0
    repository.mergedCount += status.key === 'merged' ? 1 : 0
    repository.closedCount += status.key === 'closed' ? 1 : 0

    if (
      !repository.latestUpdatedAt ||
      new Date(pullRequest.updatedAt).getTime() > new Date(repository.latestUpdatedAt).getTime()
    ) {
      repository.latestUpdatedAt = pullRequest.updatedAt
    }

    repositoriesByName.set(repoFullName, repository)
  })

  const repositories = Array.from(repositoriesByName.values())
    .map((repository) => ({
      ...repository,
      pullRequests: repository.pullRequests.sort(
        (first, second) => new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime(),
      ),
    }))
    .sort(
      (first, second) =>
        new Date(second.latestUpdatedAt).getTime() - new Date(first.latestUpdatedAt).getTime(),
    )

  return {
    repositories,
    totalCount,
    fetchedCount: filteredItems.length,
    updatedAt: new Date().toISOString(),
  }
}

async function fetchGithubPullRequests(signal) {
  const headers = {
    Accept: 'application/vnd.github+json',
  }
  const items = []
  let totalCount = 0

  for (let page = 1; page <= GITHUB_PULL_REQUESTS_MAX_PAGES; page += 1) {
    const response = await fetch(
      `https://api.github.com/search/issues?q=${encodeURIComponent(
        createGithubPullRequestSearchQuery(),
      )}&sort=updated&order=desc&per_page=${GITHUB_PULL_REQUESTS_PER_PAGE}&page=${page}`,
      { headers, signal },
    )

    if (!response.ok) {
      throw new Error('GitHub pull request request failed')
    }

    const data = await response.json()
    const pageItems = Array.isArray(data.items) ? data.items : []
    totalCount = Number(data.total_count) || pageItems.length
    items.push(...pageItems)

    if (pageItems.length < GITHUB_PULL_REQUESTS_PER_PAGE || items.length >= totalCount) {
      break
    }
  }

  const groupedPullRequests = groupGithubPullRequestsByRepository(items, totalCount)
  cacheGithubPullRequests(groupedPullRequests)
  return groupedPullRequests
}

function useGithubPullRequests() {
  const [state, setState] = useState(() => {
    const cachedPullRequests = getCachedGithubPullRequests()
    return {
      data: cachedPullRequests ?? defaultGithubPullRequestData,
      status: cachedPullRequests ? 'ready' : 'loading',
    }
  })

  useEffect(() => {
    const controller = new AbortController()

    fetchGithubPullRequests(controller.signal)
      .then((nextData) => {
        setState({ data: nextData, status: 'ready' })
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          return
        }
        setState((currentState) => ({
          ...currentState,
          status: currentState.data.repositories.length > 0 ? 'ready' : 'error',
        }))
      })

    return () => controller.abort()
  }, [])

  return state
}

function StartupLoader({ isDark, onComplete }) {
  const loaderName = 'ARUSH_KHASRU'
  const [typedName, setTypedName] = useState('')
  const [lineProgress, setLineProgress] = useState(0)
  const [phase, setPhase] = useState('typing') // 'typing', 'holding', 'progressing', 'completing'
  const hasCompletedRef = useRef(false)

  const TYPE_DELAY_MS = 140
  const HOLD_DELAY_MS = 600
  const LINE_PROGRESS_DELAY_MS = 30
  const FINAL_HOLD_MS = 50

  useEffect(() => {
    let timer = undefined

    if (phase === 'typing') {
      if (typedName.length < loaderName.length) {
        timer = window.setTimeout(() => {
          setTypedName(loaderName.slice(0, typedName.length + 1))
        }, TYPE_DELAY_MS)
      } else {
        setPhase('holding')
      }
    } else if (phase === 'holding') {
      timer = window.setTimeout(() => {
        setPhase('progressing')
      }, HOLD_DELAY_MS)
    } else if (phase === 'progressing') {
      if (lineProgress < 100) {
        timer = window.setTimeout(() => {
          setLineProgress((current) => Math.min(current + 8, 100))
        }, LINE_PROGRESS_DELAY_MS)
      } else {
        setPhase('completing')
      }
    } else if (phase === 'completing') {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true
        timer = window.setTimeout(() => {
          onComplete()
        }, FINAL_HOLD_MS)
      }
    }

    return () => window.clearTimeout(timer)
  }, [phase, typedName, lineProgress, onComplete, loaderName])

  return (
    <section
      className={`startup-loader ${isDark ? 'startup-loader--dark' : 'startup-loader--light'}`}
      aria-label="Loading portfolio"
    >
      <div className="startup-loader__content">
        <p className="startup-loader__name">
          <span className="startup-loader__typed">{typedName}</span>
          {phase === 'typing' && typedName.length < loaderName.length && (
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
      className={`logo-node relative flex h-[46px] w-[46px] shrink-0 items-center justify-center overflow-hidden rounded-lg md:h-[110px] md:w-[104px] md:rounded-xl ${isDark ? 'logo-node--flicker' : ''}`}
      aria-label="Go to About section"
      title="About"
    >
      <span aria-hidden="true" className="logo-node__pulse absolute inset-0"></span>
      <img src="/Logo.png" alt="" className="brand-logo" loading="eager" decoding="async" />
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

  if (brand === 'x') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.207-6.807-5.974 6.807H2.882l7.432-8.491L1.24 2.25h6.837l4.866 6.44 5.469-6.44zM17.15 18.75h1.828L5.693 4.069H3.75z" />
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
  const routeAliases = {
    source: 'open-source',
    pr: 'open-source',
    prs: 'open-source',
    'open-prs': 'open-source',
    'pull-requests': 'open-source',
  }
  const activeRoute = activePath === '/' ? 'about' : activePath.replace('/', '')
  const promptPrefix = `arush@portfolio:${activeRoute}`
  const scrollRef = useRef(null)
  const [entries, setEntries] = useState([
    { kind: 'output', tone: 'normal', text: `Welcome to Arush Portfolio` },
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
open source                  - open live PR route
contact [links]              - open contact links
portfolio --status           - show terminal status
clear                        - clear the terminal
Up Arrow                     - previous command
Down Arrow                   - next command`,
      )
      return
    }

    if (normalized === 'whoami') {
      appendOutput(
        `Arush Khasru
Role: Full-stack developer (MERN, Next.js, FastAPI)
Focus: Real-time systems, AI applications, and developer tools
Education: Final-year MCA | UGC NET (Computer Science), Dec 2025
Location: India`,
      )
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
      appendOutput('about projects open-source skills education')
      return
    }

    if (normalized.startsWith('open ')) {
      const target = routeAliases[normalized.replace('open ', '').trim()] ?? normalized.replace('open ', '').trim()
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
      <div className="terminal-shell flex h-[340px] flex-col overflow-hidden border border-white/15 bg-surface-container-lowest">
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
        <div className="flex min-h-0 flex-1 flex-col p-4 font-code-md text-sm leading-relaxed text-primary sm:p-6">
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
                        className={`whitespace-pre-wrap ${entry.tone === 'error' ? 'terminal-output-error' : 'terminal-output'
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
      <section className="about-intro space-y-5">
        <h1 className="font-headline-xl text-headline-xl text-on-surface">
          Hello, World...!
        </h1>
        <div className="profession-tags" aria-label="Professional focus">
          {['Full-stack Developer', 'MERN Stack', 'AI'].map(
            (tag) => (
              <span key={tag} className="profession-tag">
                {tag}
              </span>
            ),
          )}
        </div>
        <p className="font-code-md text-body-lg text-on-surface-variant">
          Full-stack developer building real-time applications, interactive AI assistants,
          and developer tools using Next.js, FastAPI, Node.js, and Socket.IO.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/Arush_CV.pdf"
            download
            className="action-btn action-btn-primary"
          >
            <span className="material-symbols-outlined action-btn__icon text-base" aria-hidden="true">
              download
            </span>
            Download CV
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
          <div
            key={project.name}
            className="lift-on-hover group flex flex-col justify-between gap-3 border border-white/10 p-4 transition-colors"
          >
            <div className="space-y-2">
              <div className="project-heading flex flex-wrap items-center gap-3">
                <h3 className="font-headline-md text-body-lg text-on-surface">{project.name}</h3>
                <span className="project-stack border border-primary/30 px-2 py-1 font-code-md text-[10px] text-primary">
                  {project.stack}
                </span>
              </div>
              <p className="text-body-md text-on-surface-variant">{project.description}</p>
            </div>
            <div className="flex items-center gap-4 mt-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="interactive-press inline-flex items-center gap-1.5 text-sm text-primary hover:text-[#86efac]"
                  title={`Open ${project.name} GitHub Repository`}
                >
                  <ContactBrandIcon brand="github" className="h-[16px] w-[16px]" />
                  <span>GitHub</span>
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="interactive-press inline-flex items-center gap-1.5 text-sm text-primary hover:text-[#86efac]"
                  title={`Open ${project.name} live demo`}
                >
                  <span className="material-symbols-outlined text-lg leading-none" aria-hidden="true">
                    arrow_outward
                  </span>
                  <span>Demo</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function OpenPullRequestsSkeleton() {
  return (
    <div className="open-pr-repo-grid" aria-hidden="true">
      {[0, 1, 2].map((item) => (
        <div key={item} className="pr-repo-card pr-repo-card--skeleton">
          <span className="pr-skeleton-line pr-skeleton-line--short"></span>
          <span className="pr-skeleton-line"></span>
          <span className="pr-skeleton-line pr-skeleton-line--medium"></span>
        </div>
      ))}
    </div>
  )
}

function OpenPullRequestsRoute() {
  const { data, status } = useGithubPullRequests()
  const { repositories, totalCount, fetchedCount } = data
  const [selectedRepositoryName, setSelectedRepositoryName] = useState('')
  const selectedRepository = repositories.find(
    (repository) => repository.fullName === selectedRepositoryName,
  )
  const hasRepositories = repositories.length > 0
  const isInitialLoading = status === 'loading' && !hasRepositories
  const statusLabel =
    status === 'error'
      ? 'GitHub unavailable'
      : 'Live from GitHub'

  useEffect(() => {
    if (!selectedRepository) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedRepositoryName('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedRepository])

  return (
    <section className="open-pr-route space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="font-code-md text-xs uppercase text-primary">Live GitHub feed</p>
          <h2 className="flex items-center gap-2 font-headline-md text-headline-md text-on-surface">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">
              account_tree
            </span>
            Open Source PRs
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Pull requests authored by {personalDetails.githubUsername}, grouped by repository.
          </p>
        </div>
        <a
          href={createGithubPullRequestSearchUrl()}
          target="_blank"
          rel="noreferrer"
          className="action-btn action-btn-ghost self-start sm:self-auto"
        >
          <ContactBrandIcon brand="github" className="h-[16px] w-[16px]" />
          GitHub Search
        </a>
      </div>

      <div className="open-pr-summary" aria-live="polite">
        <span className="open-pr-summary__status">{statusLabel}</span>
        <span>{formatGithubCount(fetchedCount)} PRs loaded</span>
        {totalCount > fetchedCount && <span>{formatGithubCount(totalCount)} available</span>}
      </div>

      {status === 'error' && (
        <div className="open-pr-message" role="status">
          GitHub could not be reached right now. Try again after the API rate limit resets.
        </div>
      )}

      {isInitialLoading && <OpenPullRequestsSkeleton />}

      {hasRepositories && (
        <div className="open-pr-repo-grid">
          {repositories.map((repository) => {
            const isSelected = selectedRepositoryName === repository.fullName

            return (
              <button
                key={repository.fullName}
                type="button"
                className={`pr-repo-card lift-on-hover ${isSelected ? 'pr-repo-card--active' : ''}`}
                aria-expanded={isSelected}
                onClick={() => setSelectedRepositoryName(repository.fullName)}
              >
                <span className="pr-repo-card__header">
                  <div className="relative flex-shrink-0">
                    <span className="pr-repo-card__icon relative overflow-hidden" aria-hidden="true">
                      <ContactBrandIcon brand="github" className="absolute h-[17px] w-[17px] z-0 opacity-40" />
                      <img 
                        src={`https://github.com/${repository.owner}.png?size=40`} 
                        alt="" 
                        className="absolute inset-0 h-full w-full object-cover z-10"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </span>
                    <span className="absolute -bottom-1 -right-1 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-surface-container-lowest text-primary border border-white/10" aria-hidden="true">
                      <ContactBrandIcon brand="github" className="h-[10px] w-[10px]" />
                    </span>
                  </div>
                  <span className="pr-repo-card__repo">
                    <span className="pr-repo-card__owner">{repository.owner}</span>
                    <span className="pr-repo-card__name">{repository.name}</span>
                  </span>
                </span>
                <span className="pr-repo-card__count">
                  {formatGithubCount(repository.pullRequests.length)} PRs
                </span>
                <span className="pr-repo-card__stats">
                  <span>{repository.openCount} open</span>
                  <span>{repository.mergedCount} merged</span>
                  <span>{repository.closedCount} closed</span>
                </span>
                <span className="pr-repo-card__updated">
                  Updated {formatGithubDate(repository.latestUpdatedAt)}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {hasRepositories && !selectedRepository && (
        <div className="open-pr-message open-pr-message--glass">
          Select a repository card to reveal its pull requests.
        </div>
      )}

      {selectedRepository && (
        <div
          className="repo-pr-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedRepositoryName('')
            }
          }}
        >
          <section
            className="repo-pr-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="repo-pr-panel-title"
          >
            <div className="repo-pr-panel__header">
              <div className="min-w-0">
                <p className="repo-pr-panel__eyebrow">Repository</p>
                <h3 id="repo-pr-panel-title">{selectedRepository.fullName}</h3>
              </div>
              <div className="repo-pr-panel__actions">
                <a
                  href={selectedRepository.url}
                  target="_blank"
                  rel="noreferrer"
                  className="interactive-press repo-pr-panel__link"
                >
                  Open repo
                  <span className="material-symbols-outlined text-base" aria-hidden="true">
                    arrow_outward
                  </span>
                </a>
                <button
                  type="button"
                  className="interactive-press repo-pr-panel__close"
                  aria-label="Close pull request panel"
                  onClick={() => setSelectedRepositoryName('')}
                >
                  <span className="material-symbols-outlined text-base" aria-hidden="true">
                    close
                  </span>
                </button>
              </div>
            </div>

            <div className="repo-pr-list">
              {selectedRepository.pullRequests.map((pullRequest) => (
                <article key={pullRequest.id} className="pr-card">
                  <div className="pr-card__heading">
                    <div className="min-w-0">
                      <p className="pr-card__repo">{pullRequest.repoFullName}</p>
                      <h4>{pullRequest.title}</h4>
                    </div>
                    <span className={`pr-status pr-status--${pullRequest.statusKey}`}>
                      {pullRequest.statusLabel}
                    </span>
                  </div>
                  <div className="pr-card__meta">
                    <span>#{pullRequest.number}</span>
                    <span>Created {formatGithubDate(pullRequest.createdAt)}</span>
                    <span>Updated {formatGithubDate(pullRequest.updatedAt)}</span>
                  </div>
                  {pullRequest.labels.length > 0 && (
                    <div className="pr-card__labels" aria-label="Pull request labels">
                      {pullRequest.labels.map((label) => (
                        <span key={label}>{label}</span>
                      ))}
                    </div>
                  )}
                  <a
                    href={pullRequest.url}
                    target="_blank"
                    rel="noreferrer"
                    className="interactive-press pr-card__link"
                  >
                    View PR
                    <span className="material-symbols-outlined text-base" aria-hidden="true">
                      arrow_outward
                    </span>
                  </a>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      {!isInitialLoading && !hasRepositories && status !== 'error' && (
        <div className="open-pr-message open-pr-message--glass">
          No open-source pull requests were found for this GitHub profile.
        </div>
      )}
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
          <article key={group.title} className="lift-on-hover skill-card p-4">
            <h3 className="mb-3 font-headline-md text-body-md text-primary">{group.title}</h3>
            <ul className="skill-card__list mt-2 space-y-2">
              {group.values.map((value) => (
                <li key={value} className="skill-card__item font-code-md text-sm text-on-surface-variant">
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
      <article className="rounded-lg border border-primary/30 bg-primary/5 p-4">
        <h3 className="font-headline-md text-body-md text-primary">Exams Qualified</h3>
        <ul className="mt-2 space-y-2">
          {examsQualified.map((exam) => (
            <li key={exam.name} className="text-body-md text-on-surface-variant space-y-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <span className="font-medium text-on-surface">{exam.name}</span>
                <span className="font-code-md text-xs text-on-surface-variant/60">{exam.timeline}</span>
              </div>
              <p className="text-sm text-on-surface-variant">{exam.detail}</p>
            </li>
          ))}
        </ul>
      </article>
    </section>
  )
}

function App() {
  const [isDark, setIsDark] = useState(getInitialTheme)
  const [showStartupLoader, setShowStartupLoader] = useState(getInitialLoaderVisibility)
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
    window.sessionStorage.setItem('portfolio-intro-seen', 'true')
    setShowStartupLoader(false)
  }, [])

  if (showStartupLoader) {
    return <StartupLoader isDark={isDark} onComplete={handleStartupComplete} />
  }

  return (
    <div className={`app-shell flex min-h-screen flex-col bg-background text-on-background selection:bg-primary selection:text-on-primary ${isDark ? 'cyber-grid' : 'dot-grid-light'}`}>
      <DecorativeVines />
      {isDark && <div className="cyber-scanline" aria-hidden="true" />}
      <header className="site-header full-width">
        <nav
          className="site-header__primary mx-auto flex max-w-[960px] items-center justify-between gap-4 px-5 py-3 font-['Space_Grotesk'] md:max-w-[900px] md:gap-6 md:px-6 md:py-5"
          aria-label="Primary navigation"
        >
          <div className="flex min-w-0 items-center gap-3 md:gap-4">
            <AKLogo onOpenAbout={() => navigate('/')} isDark={isDark} />
            <div className="min-w-0">
              <p
                className={`brand-name font-bold ${isDark ? 'text-[#e5e7eb]' : 'text-slate-800'
                  }`}
              >
                Arush Khasru
              </p>
              <div className="mt-1 hidden items-center text-base font-semibold md:flex">
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
                      className={`route-link transition-colors ${isDark
                          ? isActive
                            ? 'text-[#86efac]'
                            : 'text-[#4ade80] hover:text-[#86efac]'
                          : isActive
                            ? 'text-emerald-700'
                            : 'text-emerald-600 hover:text-emerald-700'
                        } ${index !== navLinks.length - 1
                          ? isDark
                            ? 'mr-3 border-r border-[#22c55e]/50 pr-3'
                            : 'mr-3 border-r border-emerald-500/50 pr-3'
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
          <div className="flex shrink-0 items-center gap-1">
            <div className="hidden items-center gap-1 md:flex">
              {contactProfiles.map((contact) => (
                <a
                  key={contact.key}
                  href={contact.href}
                  target={contact.key === 'email' ? undefined : '_blank'}
                  rel={contact.key === 'email' ? undefined : 'noreferrer'}
                  className={`contact-chip inline-flex items-center rounded-full p-2 text-sm ${isDark
                      ? 'text-slate-300 hover:bg-[#363a38] hover:text-[#f8fafc]'
                      : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  title={`${contact.label}: ${contact.display}`}
                  aria-label={`${contact.label}: ${contact.display}`}
                >
                  <ContactBrandIcon brand={contact.icon} />
                </a>
              ))}
            </div>
            <button
              type="button"
              className={`theme-toggle rounded-full p-2 transition-all ${isDark
                  ? 'text-slate-300 hover:bg-[#363a38] hover:text-[#f8fafc]'
                  : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              aria-label="Toggle theme"
              aria-pressed={isDark}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => setIsDark((previous) => !previous)}
            >
              <span
                className={`material-symbols-outlined transition-transform duration-300 ${isDark ? 'rotate-0' : 'rotate-180'
                  }`}
                aria-hidden="true"
              >
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>
        </nav>
        <div className="mobile-nav mx-auto grid max-w-[960px] grid-cols-5 items-center px-5 pb-3 text-center text-[12px] font-semibold md:hidden">
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
                className={`route-link transition-colors ${isDark
                    ? isActive
                      ? 'text-[#86efac]'
                      : 'text-[#4ade80] hover:text-[#86efac]'
                    : isActive
                      ? 'text-emerald-700'
                      : 'text-emerald-600 hover:text-emerald-700'
                  } ${index !== navLinks.length - 1
                    ? isDark
                      ? 'border-r border-[#22c55e]/40'
                      : 'border-r border-emerald-500/40'
                    : ''
                  }`}
              >
                {link.label}
              </a>
            )
          })}
        </div>
      </header>

      <main id="main-content" className="site-main mx-auto w-full max-w-[840px] flex-1 px-5 sm:px-6">
        <div key={currentPath} className="route-stage space-y-12 sm:space-y-14">
          {currentPath === '/' && (
            <AboutRoute onNavigate={navigate} activePath={currentPath} isDark={isDark} />
          )}
          {currentPath === '/projects' && <ProjectsRoute />}
          {currentPath === '/open-source' && <OpenPullRequestsRoute />}
          {currentPath === '/skills' && <SkillsRoute />}
          {currentPath === '/education' && <EducationRoute />}
        </div>
      </main>

      <footer className="site-footer full-width">
        <div
          className={`site-footer__content mx-auto flex max-w-[960px] items-center justify-center gap-3 px-5 py-3 font-mono text-xs uppercase md:max-w-[800px] md:px-6 md:py-4 md:text-center md:tracking-widest ${isDark ? 'text-[#4ade80]' : 'text-emerald-700'
            }`}
        >
          <span className="footer-copy">© arushkhasru.me · 2026</span>
          <div className="flex items-center gap-1 md:hidden" aria-label="Contact links">
            {contactProfiles.map((contact) => (
              <a
                key={contact.key}
                href={contact.href}
                target={contact.key === 'email' ? undefined : '_blank'}
                rel={contact.key === 'email' ? undefined : 'noreferrer'}
                className="contact-chip inline-flex items-center rounded-full p-1.5"
                title={`${contact.label}: ${contact.display}`}
                aria-label={`${contact.label}: ${contact.display}`}
              >
                <ContactBrandIcon brand={contact.icon} className="h-[16px] w-[16px]" />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}



export default App

