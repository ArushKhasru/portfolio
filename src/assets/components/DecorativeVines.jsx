function Leaf({ x, y, angle, size = 1, gradientId = 'vine-grad-left' }) {
  // All sizing is relative to `size` so we can vary leaf length naturally
  const h  = 32 * size
  const cx = 8  * size
  return (
    <g transform={`translate(${x},${y}) rotate(${angle})`}>
      {/* M0,0 = stem contact point. Leaf body grows in -y direction. */}
      <path
        d={`M0,0 C-${cx},-${h * 0.25},-${cx},-${h * 0.75},0,-${h} C${cx},-${h * 0.75},${cx},-${h * 0.25},0,0`}
        fill={`url(#${gradientId})`}
        opacity="0.88"
      />
    </g>
  )
}
 
// Utility: sample x on a cubic Bézier at parameter t
// P0=(x0,y0), P1=(x1,y1), P2=(x2,y2), P3=(x3,y3)
function bezierX(t, x0, x1, x2, x3) {
  const u = 1 - t
  return u*u*u*x0 + 3*u*u*t*x1 + 3*u*t*t*x2 + t*t*t*x3
}
function bezierY(t, y0, y1, y2, y3) {
  const u = 1 - t
  return u*u*u*y0 + 3*u*u*t*y1 + 3*u*t*t*y2 + t*t*t*y3
}
 
// Find t on a bezier segment such that bezierY(t,...) ≈ targetY (binary search)
function tAtY(targetY, y0, y1, y2, y3) {
  let lo = 0, hi = 1
  for (let i = 0; i < 32; i++) {
    const mid = (lo + hi) / 2
    bezierY(mid, y0, y1, y2, y3) < targetY ? (lo = mid) : (hi = mid)
  }
  return (lo + hi) / 2
}
 
// ──────────────────────────────────────────────────────────────────────────────
// LEFT VINE
//
// Stem: two chained cubic Bézier segments (matches the path "d" attribute below)
//   Seg 1: (lx0,0) → CP(lx1,ky1) → CP(lx2,ky2) → (lx3,240)
//   Seg 2: (lx3,240) → CP(lx4,310) → CP(lx5,400) → (lx6,500) → ... 
//
// We just hard-code the leaf (x,y) pairs computed from the path rather than
// recalculating at runtime — keeps JSX simple.
// ──────────────────────────────────────────────────────────────────────────────
function LeftVine() {
  // Stem path — same visual curve, just described accurately enough to
  // derive leaf anchor points.
  // d="M 62 0 C 95 80, 45 160, 78 240 C 105 310, 52 400, 78 490 C 100 570, 60 640, 65 760"
 
  // Leaf anchor table: [x-on-stem, y-on-stem, angle-left, angle-right?, sizeL, sizeR]
  // Single entries (no right angle) are solo leaves on one side.
  const leaves = [
    // y≈ 55: pair
    { x: 80,  y: 55,  aL: -50, aR:  55, sL: 0.9,  sR: 0.85 },
    // y≈110: solo right
    { x: 67,  y: 110, aL: null, aR:  60, sL: null, sR: 1.0  },
    // y≈165: solo left
    { x: 72,  y: 165, aL: -55, aR: null, sL: 1.05, sR: null },
    // y≈220: pair
    { x: 80,  y: 220, aL: -40, aR:  55,  sL: 0.95, sR: 0.9  },
    // y≈270: solo right
    { x: 92,  y: 270, aL: null, aR:  65, sL: null, sR: 1.0  },
    // y≈320: solo left
    { x: 90,  y: 320, aL: -60, aR: null, sL: 0.9,  sR: null },
    // y≈370: pair
    { x: 75,  y: 370, aL: -45, aR:  50,  sL: 1.0,  sR: 0.85 },
    // y≈420: solo right
    { x: 72,  y: 420, aL: null, aR:  60,  sL: null, sR: 1.0  },
    // y≈465: solo left
    { x: 80,  y: 465, aL: -55, aR: null, sL: 0.9,  sR: null },
    // y≈510: pair
    { x: 88,  y: 510, aL: -45, aR:  60,  sL: 1.05, sR: 0.85 },
    // y≈560: solo left
    { x: 92,  y: 560, aL: -40, aR: null, sL: 0.9,  sR: null },
    // y≈615: pair
    { x: 80,  y: 615, aL: -55, aR:  50,  sL: 0.95, sR: 0.8  },
    // y≈665: solo right
    { x: 72,  y: 665, aL: null, aR:  60,  sL: null, sR: 0.9  },
    // y≈720: pair (smaller — tapering at base)
    { x: 68,  y: 720, aL: -40, aR:  45,  sL: 0.75, sR: 0.7  },
  ]
 
  return (
    <svg
      className="decorative-vines left-vine"
      viewBox="0 0 120 770"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="vine-grad-left" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%"   className="leaf-grad-start" />
          <stop offset="100%" className="leaf-grad-end" />
        </linearGradient>
      </defs>
      <g className="left-vine-container">
        {/* Stem — smooth path, leaves will attach to sampled points on it */}
        <path
          d="M 62 0 C 95 80, 45 160, 78 240 C 105 310, 52 400, 78 490 C 100 570, 60 640, 65 760"
          className="vine-stem"
        />
        {leaves.map((l, i) => (
          <g key={i}>
            {l.aL !== null && (
              <Leaf x={l.x} y={l.y} angle={l.aL} size={l.sL} gradientId="vine-grad-left" />
            )}
            {l.aR !== null && (
              <Leaf x={l.x} y={l.y} angle={l.aR} size={l.sR} gradientId="vine-grad-left" />
            )}
          </g>
        ))}
      </g>
    </svg>
  )
}
 
// ──────────────────────────────────────────────────────────────────────────────
// RIGHT VINE — mirror of the left
// ──────────────────────────────────────────────────────────────────────────────
function RightVine() {
  // Stem: "M 58 0 C 25 80, 75 160, 42 240 C 15 310, 68 400, 42 490 C 20 570, 60 640, 55 760"
  const leaves = [
    { x: 40,  y: 55,  aL:  50, aR: -55, sL: 0.9,  sR: 0.85 },
    { x: 53,  y: 110, aL:  60, aR: null, sL: 1.0,  sR: null },
    { x: 48,  y: 165, aL: null, aR: -55, sL: null, sR: 1.05 },
    { x: 40,  y: 220, aL:  55, aR: -40, sL: 0.9,  sR: 0.95 },
    { x: 28,  y: 270, aL:  65, aR: null, sL: 1.0,  sR: null },
    { x: 30,  y: 320, aL: null, aR: -60, sL: null, sR: 0.9  },
    { x: 45,  y: 370, aL:  50, aR: -45, sL: 0.85, sR: 1.0  },
    { x: 48,  y: 420, aL:  60, aR: null, sL: 1.0,  sR: null },
    { x: 40,  y: 465, aL: null, aR: -55, sL: null, sR: 0.9  },
    { x: 32,  y: 510, aL:  60, aR: -45, sL: 0.85, sR: 1.05 },
    { x: 28,  y: 560, aL: null, aR: -40, sL: null, sR: 0.9  },
    { x: 40,  y: 615, aL:  50, aR: -55, sL: 0.8,  sR: 0.95 },
    { x: 48,  y: 665, aL:  60, aR: null, sL: 0.9,  sR: null },
    { x: 52,  y: 720, aL:  45, aR: -40, sL: 0.7,  sR: 0.75 },
  ]
 
  return (
    <svg
      className="decorative-vines right-vine"
      viewBox="0 0 120 770"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="vine-grad-right" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%"   className="leaf-grad-start" />
          <stop offset="100%" className="leaf-grad-end" />
        </linearGradient>
      </defs>
      <g className="right-vine-container">
        <path
          d="M 58 0 C 25 80, 75 160, 42 240 C 15 310, 68 400, 42 490 C 20 570, 60 640, 55 760"
          className="vine-stem"
        />
        {leaves.map((l, i) => (
          <g key={i}>
            {l.aL !== null && (
              <Leaf x={l.x} y={l.y} angle={l.aL} size={l.sL} gradientId="vine-grad-right" />
            )}
            {l.aR !== null && (
              <Leaf x={l.x} y={l.y} angle={l.aR} size={l.sR} gradientId="vine-grad-right" />
            )}
          </g>
        ))}
      </g>
    </svg>
  )
}
 
function DecorativeVines() {
  return (
    <>
      <LeftVine />
      <RightVine />
    </>
  )
}
 
export default DecorativeVines