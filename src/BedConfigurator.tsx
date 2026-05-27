import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { BedSvg } from './BedSvg'
import './BedConfigurator.css'

const ROW_HEIGHT_CM = 14
const BASE_PRICE_EUR = 39
const PRICE_PER_CM_EUR = 0.45

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

const eur = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
})

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function calculatePrice(length: number, depth: number, rows: number) {
  const perimeterCm = 2 * (length + depth)
  const material = perimeterCm * rows * PRICE_PER_CM_EUR
  return {
    base: BASE_PRICE_EUR,
    material,
    perimeterCm,
    total: BASE_PRICE_EUR + material,
  }
}

export function BedConfigurator() {
  const [length, setLength] = useState(DEFAULTS.length)
  const [depth, setDepth] = useState(DEFAULTS.depth)
  const [rows, setRows] = useState(DEFAULTS.rows)
  const [added, setAdded] = useState(false)

  const heightCm = rows * ROW_HEIGHT_CM
  const price = calculatePrice(length, depth, rows)

  const handleAddToBasket = () => {
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2500)
  }

  return (
    <section className="configurator">
      <header className="configurator-header">
        <p className="eyebrow">Hochbeet nach Maß</p>
        <h1>Ihr individuelles Hochbeet</h1>
        <p className="lead">
          Massive Lärchenholz-Bretter, handgefertigt in Deutschland.
          Konfigurieren Sie Ihr Hochbeet in den gewünschten Abmessungen.
        </p>
      </header>

      <div className="checkout-grid">
        <div className="preview-card">
          <BedSvg length={length} depth={depth} rows={rows} />
          <div className="preview-caption">
            <span>
              <strong>{length}</strong> cm
            </span>
            <span aria-hidden="true">×</span>
            <span>
              <strong>{depth}</strong> cm
            </span>
            <span aria-hidden="true">×</span>
            <span>
              <strong>{heightCm}</strong> cm
            </span>
          </div>
        </div>

        <aside className="sidebar">
          <div className="card config-card">
            <h2>Konfiguration</h2>
            <div className="controls">
              <ControlRow
                label="Länge"
                value={length}
                unit="cm"
                min={LIMITS.length.min}
                max={LIMITS.length.max}
                onChange={setLength}
              />
              <ControlRow
                label="Breite"
                value={depth}
                unit="cm"
                min={LIMITS.depth.min}
                max={LIMITS.depth.max}
                onChange={setDepth}
              />
              <ControlRow
                label="Höhe"
                value={rows}
                unit={`${rows === 1 ? 'Reihe' : 'Reihen'} · ${heightCm} cm`}
                min={LIMITS.rows.min}
                max={LIMITS.rows.max}
                onChange={setRows}
              />
            </div>
          </div>

          <div className="card price-card">
            <h2>Preisübersicht</h2>
            <ul className="price-breakdown">
              <li>
                <span>Grundpreis (Beschläge & Füße)</span>
                <span>{eur.format(price.base)}</span>
              </li>
              <li>
                <span>
                  Lärchenholz ({rows} {rows === 1 ? 'Reihe' : 'Reihen'} ×{' '}
                  {price.perimeterCm} cm)
                </span>
                <span>{eur.format(price.material)}</span>
              </li>
              <li className="price-total">
                <span>Gesamtpreis</span>
                <span>{eur.format(price.total)}</span>
              </li>
            </ul>
            <p className="price-note">
              Kostenloser Versand · Lieferzeit 2–3 Wochen
            </p>
            <button
              type="button"
              className={`basket-btn${added ? ' is-added' : ''}`}
              onClick={handleAddToBasket}
              disabled={added}
            >
              {added ? '✓ Im Warenkorb' : 'In den Warenkorb'}
            </button>
          </div>
        </aside>
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
  onChange: (value: number) => void
}

function ControlRow({
  label,
  value,
  unit,
  min,
  max,
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
      <div className="control-head">
        <label htmlFor={inputId} className="control-label">
          {label}
        </label>
        <div className="control-value">
          <input
            type="number"
            min={min}
            max={max}
            step={1}
            value={value}
            onChange={handleNumberChange}
            className="control-input"
            aria-label={`${label} eingeben`}
          />
          <span className="control-unit">{unit}</span>
        </div>
      </div>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={handleSliderChange}
        className="control-slider"
      />
      <div className="control-range">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
