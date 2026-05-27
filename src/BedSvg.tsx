import './BedSvg.css'

const SCALE = 3
const DEPTH_X_RATIO = 0.7
const DEPTH_Y_RATIO = 0.4
const ROW_HEIGHT_CM = 14
const WOOD_THICKNESS_CM = 4
const FOOT_HEIGHT_CM = 3
const FOOT_WIDTH_CM = 8
const PADDING = 30

const MAX_LENGTH = 125
const MAX_DEPTH = 50
const MAX_ROWS = 5

interface Props {
  length: number
  depth: number
  rows: number
}

export function BedSvg({ length, depth, rows }: Props) {
  const heightCm = rows * ROW_HEIGHT_CM

  const maxLenPx = MAX_LENGTH * SCALE
  const maxDepthXPx = MAX_DEPTH * SCALE * DEPTH_X_RATIO
  const maxDepthYPx = MAX_DEPTH * SCALE * DEPTH_Y_RATIO
  const maxHeightPx = MAX_ROWS * ROW_HEIGHT_CM * SCALE
  const maxFootPx = FOOT_HEIGHT_CM * SCALE

  const W = maxLenPx + maxDepthXPx + PADDING * 2
  const H = maxHeightPx + maxDepthYPx + maxFootPx + PADDING * 2

  const L = length * SCALE
  const dX = depth * SCALE * DEPTH_X_RATIO
  const dY = depth * SCALE * DEPTH_Y_RATIO
  const Ht = heightCm * SCALE
  const wt = WOOD_THICKNESS_CM * SCALE
  const wtDX = WOOD_THICKNESS_CM * SCALE * DEPTH_X_RATIO
  const wtDY = WOOD_THICKNESS_CM * SCALE * DEPTH_Y_RATIO
  const footH = FOOT_HEIGHT_CM * SCALE
  const footW = FOOT_WIDTH_CM * SCALE

  const bedW = L + dX
  const bedH = Ht + dY

  const fblX = (W - bedW) / 2
  const fblY = (H - bedH - maxFootPx) / 2 + bedH

  const FBL = { x: fblX, y: fblY }
  const FBR = { x: fblX + L, y: fblY }
  const FTL = { x: fblX, y: fblY - Ht }
  const FTR = { x: fblX + L, y: fblY - Ht }
  const BBR = { x: FBR.x + dX, y: FBR.y - dY }
  const BTL = { x: FTL.x + dX, y: FTL.y - dY }
  const BTR = { x: FTR.x + dX, y: FTR.y - dY }

  const iFTL = { x: FTL.x + wt + wtDX, y: FTL.y - wtDY }
  const iFTR = { x: FTR.x - wt + wtDX, y: FTR.y - wtDY }
  const iBTL = { x: BTL.x + wt - wtDX, y: BTL.y + wtDY }
  const iBTR = { x: BTR.x - wt - wtDX, y: BTR.y + wtDY }

  const plankLines: Array<{ x1: number; y1: number; x2: number; y2: number }> =
    []
  for (let i = 1; i < rows; i++) {
    const yOff = i * ROW_HEIGHT_CM * SCALE
    plankLines.push({
      x1: FBL.x,
      y1: FBL.y - yOff,
      x2: FBR.x,
      y2: FBR.y - yOff,
    })
    plankLines.push({
      x1: FBR.x,
      y1: FBR.y - yOff,
      x2: BBR.x,
      y2: BBR.y - yOff,
    })
  }

  const polyPoints = (pts: { x: number; y: number }[]) =>
    pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')

  const flFoot = polyPoints([
    { x: FBL.x, y: FBL.y },
    { x: FBL.x + footW, y: FBL.y },
    { x: FBL.x + footW, y: FBL.y + footH },
    { x: FBL.x, y: FBL.y + footH },
  ])
  const frFoot = polyPoints([
    { x: FBR.x - footW, y: FBR.y },
    { x: FBR.x, y: FBR.y },
    { x: FBR.x, y: FBR.y + footH },
    { x: FBR.x - footW, y: FBR.y + footH },
  ])
  const brFootDX = FOOT_WIDTH_CM * SCALE * DEPTH_X_RATIO
  const brFootDY = FOOT_WIDTH_CM * SCALE * DEPTH_Y_RATIO
  const brFoot = polyPoints([
    { x: BBR.x - brFootDX, y: BBR.y + brFootDY },
    { x: BBR.x, y: BBR.y },
    { x: BBR.x, y: BBR.y + footH },
    { x: BBR.x - brFootDX, y: BBR.y + footH + brFootDY },
  ])

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="bed-svg"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Raised bed preview: ${length}cm by ${depth}cm, ${rows} row${rows === 1 ? '' : 's'} (${heightCm}cm tall)`}
    >
      <polygon
        className="bed-foot"
        points={brFoot}
      />

      <polygon
        className="bed-face"
        points={polyPoints([FBL, FBR, FTR, FTL])}
      />

      <polygon
        className="bed-face"
        points={polyPoints([FBR, BBR, BTR, FTR])}
      />

      <polygon
        className="bed-top-rim"
        points={polyPoints([FTL, FTR, BTR, BTL])}
      />

      <polygon
        className="bed-top-inner"
        points={polyPoints([iFTL, iFTR, iBTR, iBTL])}
      />

      {plankLines.map((line, i) => (
        <line
          key={i}
          className="bed-plank"
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
        />
      ))}

      <polygon className="bed-foot" points={flFoot} />
      <polygon className="bed-foot" points={frFoot} />
    </svg>
  )
}
