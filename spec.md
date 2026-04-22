# Portfolio Website Specification (Reference-Inspired)

## 1. Purpose
Build a modern personal portfolio inspired by:
- https://www.kassq.dev/
- https://www.vovacodes.ca/

The portfolio should feel interactive and memorable (desktop-style UX), while still being easy to navigate and maintain.

## 2. Reference Analysis Summary

### A. kassq.dev (Key Patterns)
- Strong **Windows desktop metaphor** (desktop icons, taskbar, windows, terminal, notepad, media viewer).
- Main content grouped into folders/windows:
  - About me (Notepad style)
  - Projects (GitHub repo list)
  - Tools
  - Podcasts
  - Links
  - Pictures
  - Videos
- Fun interactions: select/delete desktop icons, open apps, terminal-like command responses.
- Tone: playful, personal, tech-native.

### B. vovacodes.ca (Key Patterns)
- Also desktop-inspired, but with a richer **portfolio storytelling flow**.
- Dedicated routes for:
  - About
  - Projects
  - Contact
  - Resume
- Includes:
  - Skills grid (frontend/backend stack)
  - Project case-study sections with tech tags and live/github links
  - Contact form + social links
  - Animated transitions and section-based narrative
- Tone: professional + creative.

### C. Practical Takeaway
Best result = combine:
- **kassq-style interaction shell** (desktop metaphor),
- with **vovacodes-style structured professional content** (about/skills/projects/contact).

## 3. Product Goals
1. Showcase personality and technical skill.
2. Make projects easy to scan and open.
3. Provide direct contact pathways.
4. Keep performance, accessibility, and SEO solid despite rich UI.

## 4. Scope (MVP)

### Required Screens / Views
1. **Desktop Home**
   - Wallpaper background
   - App/shortcut icons
   - Taskbar with clock + quick launch
2. **About Window**
   - Bio, experience summary, current role, interests
3. **Projects Window**
   - Project cards/table with: title, short summary, stack, links
4. **Skills Window**
   - Frontend / Backend / Tools grouped list
5. **Contact Window**
   - Email CTA + social links
   - Optional form (name, email, message)

### Optional (Phase 2)
- Media gallery (pictures/videos)
- Terminal mini-app (help, ls, whoami, echo)
- Resume window/download

## 5. Information Architecture
- `/` → Desktop shell
- `/about` → About content
- `/projects` → Projects list/details
- `/skills` → Skills
- `/contact` → Contact
- `/resume` (optional)

Desktop icons should route/open these views as windows.

## 6. Content Model

### Profile
- Name
- Headline
- Location
- Bio
- Current role
- Social links

### Project
- id
- title
- description (short + optional long)
- techStack[]
- liveUrl
- githubUrl
- image
- featured (boolean)

### Skills
- category (Frontend, Backend, Tools, Cloud, etc.)
- items[]

Use local JSON/TS data files first; later connect GitHub API if needed.

## 7. UX & Visual Guidelines
- Desktop metaphor should enhance, not block navigation.
- Every interactive element needs a clear fallback on mobile.
- Keep readable contrast and minimum 16px body text.
- Use subtle motion (open/close/fade/slide), avoid heavy constant animation.
- Make all windows closable/minimizable and keyboard-friendly.

## 8. Technical Specification
- **Framework:** Next.js + React + TypeScript
- **Styling:** Tailwind CSS or styled-components (choose one and stay consistent)
- **State:** lightweight local state (window open/close/focus/z-index)
- **Deployment:** Vercel
- **SEO:** per-page title/description + Open Graph
- **Analytics (optional):** privacy-friendly tracking

## 9. Accessibility & Quality Requirements
- Keyboard navigation for icons/windows/buttons.
- Visible focus states.
- Semantic headings and landmarks.
- Alt text on all meaningful images/icons.
- Mobile responsiveness from 320px+.
- Lighthouse target:
  - Performance: 85+
  - Accessibility: 95+
  - Best Practices: 90+
  - SEO: 90+

## 10. Build Plan
1. **Foundation**
   - Set up Next.js + TypeScript + styling + route skeleton
2. **Desktop Shell**
   - Desktop layout, icons, taskbar, window manager
3. **Core Content Windows**
   - About, Projects, Skills, Contact
4. **Polish**
   - Motion, SEO metadata, accessibility pass
5. **Optional Features**
   - Terminal, gallery, resume enhancements

## 11. Acceptance Criteria
- User can open all core sections from desktop icons.
- Projects include live/github links and stack tags.
- Contact options are clearly visible and functional.
- Site works on mobile and desktop.
- Page load and interaction remain smooth.
- Design reflects personal branding without cloning reference sites.

