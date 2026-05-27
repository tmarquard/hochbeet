import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { BedSvg } from './BedSvg'
import type { BedColor } from './BedSvg'
import type { BasketItem } from './Basket'
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
  color: 'natural' as BedColor,
}

const COLOR_OPTIONS: Array<{
  id: BedColor
  label: string
  swatch: string
  premium: number
}> = [
  { id: 'natural', label: 'Natur', swatch: '#d4a574', premium: 0 },
  { id: 'dark', label: 'Dunkelbraun', swatch: '#5c3f22', premium: 25 },
  { id: 'black', label: 'Schwarz', swatch: '#1a1612', premium: 35 },
]

const eur = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
})

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function calculatePrice(
  length: number,
  depth: number,
  rows: number,
  color: BedColor,
) {
  const perimeterCm = 2 * (length + depth)
  const material = perimeterCm * rows * PRICE_PER_CM_EUR
  const colorPremium =
    COLOR_OPTIONS.find((c) => c.id === color)?.premium ?? 0
  return {
    base: BASE_PRICE_EUR,
    material,
    colorPremium,
    perimeterCm,
    total: BASE_PRICE_EUR + material + colorPremium,
  }
}

interface Props {
  onAddToBasket: (config: Omit<BasketItem, 'id'>) => void
}

export function BedConfigurator({ onAddToBasket }: Props) {
  const [length, setLength] = useState(DEFAULTS.length)
  const [depth, setDepth] = useState(DEFAULTS.depth)
  const [rows, setRows] = useState(DEFAULTS.rows)
  const [color, setColor] = useState<BedColor>(DEFAULTS.color)
  const [justAdded, setJustAdded] = useState(false)

  const heightCm = rows * ROW_HEIGHT_CM
  const price = calculatePrice(length, depth, rows, color)
  const selectedColor = COLOR_OPTIONS.find((c) => c.id === color)!

  const handleAddToBasket = () => {
    onAddToBasket({
      length,
      depth,
      rows,
      color,
      colorLabel: selectedColor.label,
      price: price.total,
    })
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 2000)
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

      <div className="main-grid">
        <div className="preview-card">
          <BedSvg length={length} depth={depth} rows={rows} color={color} />
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
            <span className="preview-divider" aria-hidden="true">
              ·
            </span>
            <span>{selectedColor.label}</span>
          </div>
        </div>

        <div className="card config-card">
          <h2>Konfiguration</h2>

          <ColorSelector value={color} onChange={setColor} />

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
      </div>

      <div className="card price-summary">
        <div className="price-stats">
          <PriceStat
            label="Grundpreis"
            value={eur.format(price.base)}
          />
          <PriceStat
            label="Lärchenholz"
            value={eur.format(price.material)}
            hint={`${rows} × ${price.perimeterCm} cm`}
          />
          {price.colorPremium > 0 && (
            <PriceStat
              label={`Oberfläche · ${selectedColor.label}`}
              value={eur.format(price.colorPremium)}
            />
          )}
          <PriceStat
            label="Gesamtpreis"
            value={eur.format(price.total)}
            highlight
          />
        </div>
        <div className="price-summary-cta">
          <p className="shipping-note">
            Kostenloser Versand · 2–3 Wochen
          </p>
          <button
            type="button"
            className={`basket-btn price-summary-btn${justAdded ? ' is-added' : ''}`}
            onClick={handleAddToBasket}
          >
            {justAdded ? '✓ Hinzugefügt' : 'In den Warenkorb'}
          </button>
        </div>
      </div>
    </section>
  )
}

interface PriceStatProps {
  label: string
  value: string
  hint?: string
  highlight?: boolean
}

function PriceStat({ label, value, hint, highlight }: PriceStatProps) {
  return (
    <div className={`price-stat${highlight ? ' is-total' : ''}`}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {hint && <span className="stat-hint">{hint}</span>}
    </div>
  )
}

interface ColorSelectorProps {
  value: BedColor
  onChange: (color: BedColor) => void
}

function ColorSelector({ value, onChange }: ColorSelectorProps) {
  return (
    <div className="color-selector" role="radiogroup" aria-label="Holzfarbe">
      <span className="color-selector-label">Farbe</span>
      <div className="color-options">
        {COLOR_OPTIONS.map((option) => {
          const isSelected = value === option.id
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`color-swatch${isSelected ? ' is-selected' : ''}`}
              onClick={() => onChange(option.id)}
            >
              <span
                className="swatch-color"
                style={{ background: option.swatch }}
                aria-hidden="true"
              />
              <span className="swatch-label">
                {option.label}
                {option.premium > 0 && (
                  <span className="swatch-premium">
                    +{eur.format(option.premium)}
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </div>
    </div>
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
