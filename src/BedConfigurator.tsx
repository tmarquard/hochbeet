import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { BedSvg } from './BedSvg'
import './BedConfigurator.css'

const ROW_HEIGHT_CM = 14

const LIMITS = {
  length: { min: 30, max: 125 },
  depth: { min: 15, max: 50 },
  rows: { min: 1, max: 5 },
}

const DEFAULTS = {
  length: 60,
  depth: 20,
  rows: 2,
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export function BedConfigurator() {
  const [length, setLength] = useState(DEFAULTS.length)
  const [depth, setDepth] = useState(DEFAULTS.depth)
  const [rows, setRows] = useState(DEFAULTS.rows)

  const heightCm = rows * ROW_HEIGHT_CM

  return (
    <section className="configurator">
      <header className="configurator-header">
        <h1>Hochbeet Configurator</h1>
        <p>Design a custom raised bed by adjusting length, depth, and height.</p>
      </header>

      <div className="preview">
        <BedSvg length={length} depth={depth} rows={rows} />
      </div>

      <div className="controls">
        <ControlRow
          label="Length"
          value={length}
          unit="cm"
          min={LIMITS.length.min}
          max={LIMITS.length.max}
          step={1}
          onChange={setLength}
        />
        <ControlRow
          label="Depth"
          value={depth}
          unit="cm"
          min={LIMITS.depth.min}
          max={LIMITS.depth.max}
          step={1}
          onChange={setDepth}
        />
        <ControlRow
          label="Height"
          value={rows}
          unit={`${rows === 1 ? 'row' : 'rows'} · ${heightCm} cm`}
          min={LIMITS.rows.min}
          max={LIMITS.rows.max}
          step={1}
          onChange={setRows}
        />
      </div>
    </section>
  )
}

interface ControlRowProps {
  label: string
  value: number
  unit: string
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}

function ControlRow({
  label,
  value,
  unit,
  min,
  max,
  step,
  onChange,
}: ControlRowProps) {
  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value, 10)
    if (Number.isNaN(raw)) return
    onChange(clamp(raw, min, max))
  }

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value))
  }

  const inputId = `control-${label.toLowerCase()}`

  return (
    <div className="control-row">
      <label htmlFor={inputId} className="control-label">
        {label}
      </label>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleSliderChange}
        className="control-slider"
      />
      <div className="control-value">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleNumberChange}
          className="control-input"
          aria-label={`${label} value`}
        />
        <span className="control-unit">{unit}</span>
      </div>
    </div>
  )
}
