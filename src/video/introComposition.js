export const INTRO_DURATION = 25

const C = { bg: '#050907', ink: '#0b1710', fg: '#edf7ef', muted: '#a2b8a8', accent: '#66f5a0', line: '#244332' }
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x))
const ease = x => 1 - (1 - clamp(x)) ** 4
const lerp = (a, b, t) => a + (b - a) * t

export async function createIntroRenderer(canvas) {
  const font = new FontFace('IntroSpace', 'url(/video/assets/space-grotesk-bold.ttf)', { weight: '700' })
  await font.load()
  document.fonts.add(font)
  const logo = await new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = '/Logo.png'
  })
  const ctx = canvas.getContext('2d', { alpha: false })
  const portrait = canvas.height > canvas.width
  const W = portrait ? 900 : 1600
  const H = portrait ? 1600 : 900
  const margin = portrait ? 68 : 100

  function text(value, x, y, size = 40, color = C.fg, align = 'left', alpha = 1) {
    ctx.save()
    ctx.globalAlpha *= clamp(alpha)
    ctx.fillStyle = color
    ctx.font = `700 ${size}px IntroSpace, sans-serif`
    ctx.textAlign = align
    ctx.fillText(value, x, y)
    ctx.restore()
  }

  function line(x1, y1, x2, y2, color = C.line, width = 1) {
    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width
    ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
  }

  function rect(x, y, w, h, color, radius = 0) {
    ctx.beginPath(); ctx.fillStyle = color
    ctx.roundRect(x, y, w, h, radius); ctx.fill()
  }

  function logoPart(part, x, y, width, alpha = 1) {
    ctx.save(); ctx.globalAlpha *= alpha
    const sx = part === 'A' ? 46 : 312
    const sw = part === 'A' ? 270 : 240
    ctx.drawImage(logo, sx, 74, sw, 360, x, y, width, width * 360 / sw)
    ctx.restore()
  }

  function background(t) {
    rect(0, 0, W, H, C.bg)
    const glow = ctx.createRadialGradient(W * .82, H * .62, 0, W * .82, H * .62, W * .7)
    glow.addColorStop(0, '#102e1d'); glow.addColorStop(.6, '#08130d'); glow.addColorStop(1, C.bg)
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H)
    for (let i = 0; i < 65; i++) {
      ctx.globalAlpha = .13 + (Math.sin(i * 7.3 + t * .35) + 1) * .08
      ctx.fillStyle = C.accent; ctx.beginPath()
      ctx.arc((i * 137.57 + 53) % W, (i * i * 19.33 + 41) % H, i % 11 === 0 ? 2 : .9, 0, Math.PI * 2); ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  function chrome(t, scene) {
    text('ARUSH KHASRU', margin, 54, 17, C.muted)
    text('AI + FULL-STACK DEVELOPER', W - margin, 54, portrait ? 14 : 17, C.muted, 'right')
    line(margin, H - 72, W - margin, H - 72)
    line(margin, H - 72, margin + (W - margin * 2) * clamp(t / INTRO_DURATION), H - 72, C.accent, 2)
    text(['INTRODUCTION', 'WHO AM I', 'SELECTED BUILDS', 'SKILLS', 'LET\u2019S BUILD'][scene], margin, H - 35, 16, C.muted)
    text(`${String(Math.floor(t)).padStart(2, '0')} / 25`, W - margin, H - 35, 16, C.muted, 'right')
  }

  function opener(t) {
    const appear = ease(t / .75)
    const split = ease((t - .9) / .85)
    const centralY = portrait ? 500 : 310
    const aX = lerp(W / 2 - 180, margin, split)
    const kX = lerp(W / 2 + 7, W - margin - 170, split)
    logoPart('A', aX, centralY - 20 * (1 - appear), 180 * lerp(.86, 1, appear), appear)
    logoPart('K', kX, centralY - 20 * (1 - appear), 170 * lerp(.86, 1, appear), appear)
    if (t > 1.65) {
      const chars = Math.floor(clamp((t - 1.65) / 1.25) * 12)
      const name = 'ARUSH KHASRU'.slice(0, chars)
      const size = portrait ? 92 : 112
      if (portrait) {
        text(name.slice(0, 5), W / 2, 870, size, C.fg, 'center')
        text(name.slice(6), W / 2, 980, size, C.fg, 'center')
      } else text(name, W / 2, 435, size, C.fg, 'center')
      const cursor = t < 3.1 || Math.floor(t * 3) % 2 === 0
      if (cursor) {
        ctx.font = `700 ${size}px IntroSpace`
        const lastLine = portrait ? name.slice(6) : name
        rect(W / 2 + ctx.measureText(lastLine).width / 2 + 10, portrait ? 909 : 353, 5, portrait ? 82 : 94, C.accent)
      }
      text('AI + FULL-STACK DEVELOPER', W / 2, portrait ? 1070 : 540, portrait ? 28 : 25, C.accent, 'center', ease((t - 2.7) / .55))
    }
  }

  function who(t) {
    const intro = 1 - ease((t - .65) / .65)
    if (intro > .005) {
      ctx.save(); ctx.globalAlpha = intro; ctx.filter = `blur(${(1 - intro) * 12}px)`
      text('Who am I?', W / 2, H * .5 + 50 * (1 - intro), portrait ? 110 : 150, C.fg, 'center'); ctx.restore()
    }
    const answer = ease((t - .7) / .65)
    ctx.save(); ctx.globalAlpha = answer; ctx.translate(0, 70 * (1 - answer))
    text('Who am I?', margin, portrait ? 285 : 205, portrait ? 48 : 38, C.muted)
    text('AI & full-stack', margin, portrait ? 540 : 375, portrait ? 90 : 125, C.fg)
    text('developer.', margin, portrait ? 650 : 505, portrait ? 100 : 125, C.accent)
    const facts = [
      ['Currently', 'AI Trainer at Handshake AI'],
      ['I build', 'Web apps, AI tools, developer tools.'],
      ['My focus', 'Useful products. Thoughtful engineering.'],
    ]
    facts.forEach(([label, value], i) => {
      const a = ease((t - 1.4 - i * .2) / .5)
      const y = portrait ? 870 + i * 135 : 615 + i * 58
      text(label, margin, y, 22, C.muted, 'left', a)
      text(value, portrait ? margin : margin + 220, portrait ? y + 48 : y, portrait ? 29 : 29, C.fg, 'left', a)
    })
    ctx.restore()
  }

  function projectCover(index, x, y, w, h, t) {
    ctx.save(); ctx.translate(x, y)
    rect(0, 0, w, h, index === 1 ? '#e2e9d8' : '#0a1810', 14)
    ctx.beginPath(); ctx.roundRect(0, 0, w, h, 14); ctx.clip()
    const s = w / 1000
    ctx.scale(s, s)
    const ch = h / s
    if (index === 0) {
      rect(0, 0, 1000, 70, '#17271d')
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.fillStyle = ['#e9a78d', '#e9cd89', C.accent][i]; ctx.arc(40 + i * 25, 35, 6, 0, Math.PI * 2); ctx.fill() }
      text('perky / workspace', 500, 43, 20, C.muted, 'center')
      text('$ npm i -g perky', 60, 150, 34, C.fg)
      const cmds = ['$ perky start', '$ perky ask', '$ perky explain']
      cmds.forEach((cmd, i) => text(cmd, 60, 235 + i * 72, 33, i === Math.floor(t * 1.4) % 3 ? C.accent : C.muted))
      line(60, ch - 115, 940, ch - 115)
      text('Workspace automation + AI assistance', 60, ch - 62, 25, C.accent)
    } else if (index === 1) {
      text('Socratic AI', 58, 94, 58, '#173323')
      line(58, 135, 942, 135, '#a9bda5')
      text('Better questions.', 58, ch * .43, 75, '#173323')
      text('Deeper understanding.', 58, ch * .43 + 88, 66, '#173323')
      const words = ['Ask', 'Reason', 'Understand']
      words.forEach((word, i) => {
        rect(58 + i * 290, ch - 158, 260, 80, i === 1 ? '#24563a' : '#cad8be', 8)
        text(word, 188 + i * 290, ch - 105, 29, i === 1 ? '#ecf4e5' : '#24402d', 'center')
      })
    } else {
      text('OpenEnv', 58, 94, 58, C.accent)
      text('Bug Triage', 58, 158, 46, C.fg)
      const labels = ['CLASSIFY', 'FIND DUPLICATES', 'ESCALATE']
      labels.forEach((value, i) => {
        const py = 212 + i * ((ch - 280) / 3)
        rect(58, py, 884, (ch - 305) / 3, i === 1 ? '#193c29' : '#10251a', 8)
        text(value, 85, py + 43, 25, i === Math.floor(t) % 3 ? C.accent : C.fg)
        line(770, py + 34, 900, py + 34, C.accent, 3)
      })
    }
    ctx.restore()
  }

  function work(t) {
    const prompt = 1 - ease((t - .65) / .6)
    if (prompt > .005) {
      ctx.save(); ctx.globalAlpha = prompt
      text('What have', W / 2, H * .43, portrait ? 100 : 140, C.fg, 'center')
      text('I built?', W / 2, H * .43 + 150, portrait ? 130 : 150, C.accent, 'center'); ctx.restore()
    }
    if (t < .7) return
    const projects = [
      ['perky', 'CLI workspace launcher + AI assistant', 'Node.js / Commander / AI'],
      ['Socratic AI', 'Guided learning through better questions', 'TypeScript / Next.js / FastAPI'],
      ['OpenEnv', 'An AI evaluation environment for bug triage', 'Python / FastAPI / Pydantic'],
    ]
    const elapsed = t - .85
    if (elapsed < 6.35) {
      const index = Math.min(2, Math.floor(Math.max(0, elapsed) / 2.12))
      const p = projects[index]
      const local = elapsed - index * 2.12
      const enter = ease(local / .55)
      ctx.save(); ctx.globalAlpha = enter; ctx.translate(70 * (1 - enter), 0)
      text('What have I built?', margin, portrait ? 245 : 150, portrait ? 42 : 32, C.muted)
      text(p[0], margin, portrait ? 425 : 315, portrait ? 105 : index === 1 ? 95 : 125, C.fg)
      if (portrait) {
        text(p[1].length > 40 ? 'AI evaluation for bug triage' : p[1], margin, 493, 25, C.muted)
        projectCover(index, margin, 580, W - margin * 2, 610, t)
        text(p[2], margin, 1290, 25, C.accent)
      } else {
        const desc = p[1].split(' ')
        let lineText = '', row = 0
        desc.forEach(word => {
          if ((lineText + word).length > 28) { text(lineText.trim(), margin, 405 + row * 43, 29, C.muted); row++; lineText = '' }
          lineText += word + ' '
        })
        text(lineText.trim(), margin, 405 + row * 43, 29, C.muted)
        text(p[2], margin, 660, 22, C.accent)
        projectCover(index, 705, 210, 805, 475, t)
      }
      ctx.restore()
    } else {
      const zoom = ease((elapsed - 6.35) / .65)
      text('From idea to working software.', margin, portrait ? 250 : 175, portrait ? 46 : 64, C.fg)
      projects.forEach((p, i) => {
        const w = portrait ? W - margin * 2 : 444
        const h = portrait ? 270 : 340
        const x = portrait ? margin : margin + i * 478
        const y = portrait ? 350 + i * 350 : 300
        ctx.save(); ctx.globalAlpha = zoom; ctx.translate(W / 2, H / 2); ctx.scale(lerp(1.15, 1, zoom), lerp(1.15, 1, zoom)); ctx.translate(-W / 2, -H / 2)
        projectCover(i, x, y, w, h, t); text(p[0], x, y + h + 48, 32, C.accent); ctx.restore()
      })
    }
  }

  function skills(t) {
    const a = ease(t / .6)
    ctx.save(); ctx.globalAlpha = a; ctx.translate(0, 55 * (1 - a))
    text('What are my skills?', margin, portrait ? 250 : 170, portrait ? 53 : 65, C.fg)
    const groups = [
      ['Build', 'React / Next.js / Node.js / FastAPI'],
      ['Work with AI', 'Codex / Claude Code / Gemini CLI'],
      ['Ship', 'Python / JavaScript / SQL / Git'],
    ]
    const focus = Math.min(2, Math.floor(Math.max(0, t - .45) / 1.1))
    groups.forEach(([label, tools], i) => {
      const y = portrait ? 500 + i * 280 : 340 + i * 160
      ctx.save(); ctx.globalAlpha = i === focus ? 1 : .47
      const slide = 45 * (1 - ease((t - i * .17) / .6))
      text(label, margin + slide, y, portrait ? 82 : 82, i === focus ? C.accent : C.fg)
      if (portrait) {
        const items = tools.split(' / ')
        text(items.slice(0, 2).join(' / '), margin + slide, y + 65, 31, C.fg)
        if (items.length > 2) text(items.slice(2).join(' / '), margin + slide, y + 110, 31, C.fg)
      } else text(tools, 605 + slide, y - 6, 35, C.fg)
      line(margin, y + (portrait ? 160 : 65), W - margin, y + (portrait ? 160 : 65)); ctx.restore()
    })
    ctx.restore()
  }

  function closing(t) {
    const a = ease(t / .6)
    ctx.save(); ctx.globalAlpha = a; ctx.translate(0, 35 * (1 - a))
    const top = portrait ? 570 : 365
    text('Let\u2019s build', W / 2, top, portrait ? 112 : 130, C.fg, 'center')
    text('something useful.', W / 2, top + (portrait ? 130 : 150), portrait ? 75 : 130, C.accent, 'center')
    text('arushkhasru.me', W / 2, top + (portrait ? 260 : 260), portrait ? 36 : 30, C.fg, 'center')
    ctx.restore()
  }

  function render(time) {
    const t = clamp(time, 0, INTRO_DURATION)
    ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0)
    ctx.globalAlpha = 1; ctx.filter = 'none'
    background(t)
    const starts = [0, 4.3, 9.4, 18.2, 22.8]
    let scene = 0
    for (let i = 0; i < starts.length; i++) if (t >= starts[i]) scene = i
    const local = t - starts[scene]
    const out = scene < 4 ? 1 - ease((t - starts[scene + 1] + .25) / .25) : 1
    ctx.save(); ctx.globalAlpha = out
    ;[opener, who, work, skills, closing][scene](local)
    ctx.restore()
    chrome(t, scene)
    for (const at of starts.slice(1)) {
      const p = (t - at + .24) / .48
      if (p > 0 && p < 1) {
        const x = lerp(-W, W, ease(p))
        rect(x, 0, W * .8, H, C.accent)
      }
    }
    return { time: t, scene }
  }

  return { render, duration: INTRO_DURATION }
}
