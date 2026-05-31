export interface Point {
  x: number
  y: number
}

export interface Milestone extends Point {
  label: string
  emphasis?: boolean
}

export const VIEW = { width: 1200, height: 600 } as const
export const AXIS_Y = 540
export const X_START = 24
export const X_END = 1176

export function buildSmoothPath(points: Point[]): string {
  if (points.length < 2) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
  }
  return d
}

interface SeriesConfig {
  yTop: number
  yBase: number
  ease: number
  waveAmp: number
  waveGain: number
  waves: number
  phase: number
}

function seriesY(x: number, c: SeriesConfig): number {
  const t = (x - X_START) / (X_END - X_START)
  const eased = Math.pow(t, c.ease)
  const trend = c.yBase + (c.yTop - c.yBase) * eased
  const amp = c.waveAmp + c.waveGain * t
  const wave = -amp * Math.sin(t * Math.PI * c.waves + c.phase)
  return trend + wave
}

function sampleSeries(c: SeriesConfig, steps = 64): Point[] {
  const pts: Point[] = []
  for (let i = 0; i <= steps; i++) {
    const x = X_START + ((X_END - X_START) * i) / steps
    pts.push({ x, y: seriesY(x, c) })
  }
  return pts
}

const MOMENTUM: SeriesConfig = {
  yBase: 502,
  yTop: 96,
  ease: 1.45,
  waveAmp: 5,
  waveGain: 16,
  waves: 6.4,
  phase: 0.6,
}

const TIME: SeriesConfig = {
  yBase: 512,
  yTop: 214,
  ease: 1.28,
  waveAmp: 3,
  waveGain: 7,
  waves: 5.6,
  phase: 0.2,
}

export const momentumPoints = sampleSeries(MOMENTUM)
export const momentumPath = buildSmoothPath(momentumPoints)
export const timePath = buildSmoothPath(sampleSeries(TIME))

export const momentumAreaPath =
  momentumPath + ` L ${X_END} ${AXIS_Y} L ${X_START} ${AXIS_Y} Z`

const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

function labelFor(daysAgo: number, now: Date): string {
  if (daysAgo === 0) return 'Today'
  const d = new Date(now)
  d.setDate(d.getDate() - daysAgo)
  return dateFormat.format(d)
}

const MILESTONE_DEFS = [
  { x: 300, daysAgo: 30 },
  { x: 545, daysAgo: 25 },
  { x: 730, daysAgo: 19 },
  { x: 915, daysAgo: 7 },
  { x: 1095, daysAgo: 0, emphasis: true },
] as const

const now = new Date()

export const milestones: Milestone[] = MILESTONE_DEFS.map((m) => ({
  x: m.x,
  y: seriesY(m.x, MOMENTUM),
  label: labelFor(m.daysAgo, now),
  emphasis: 'emphasis' in m ? m.emphasis : undefined,
}))

export const endpoint: Point = momentumPoints[momentumPoints.length - 1]
