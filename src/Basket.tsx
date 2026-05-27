import { useEffect, useRef, useState } from 'react'
import type { BedColor } from './BedSvg'
import './Basket.css'

export interface BasketItem {
  id: string
  length: number
  depth: number
  rows: number
  color: BedColor
  colorLabel: string
  price: number
}

const eur = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
})

interface BasketButtonProps {
  items: BasketItem[]
  onRemove: (id: string) => void
}

export function BasketButton({ items, onRemove }: BasketButtonProps) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (buttonRef.current?.contains(target)) return
      if (dropdownRef.current?.contains(target)) return
      setOpen(false)
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const total = items.reduce((sum, item) => sum + item.price, 0)
  const count = items.length

  return (
    <div className="basket-wrapper">
      <button
        ref={buttonRef}
        type="button"
        className="basket-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Warenkorb (${count} ${count === 1 ? 'Artikel' : 'Artikel'})`}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <BasketIcon />
        {count > 0 && (
          <span className="basket-badge" aria-hidden="true">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="basket-dropdown"
          role="dialog"
          aria-label="Warenkorb"
        >
          <div className="basket-dropdown-header">
            <h3>Warenkorb</h3>
            <button
              type="button"
              className="basket-close"
              onClick={() => setOpen(false)}
              aria-label="Schließen"
            >
              ×
            </button>
          </div>

          {items.length === 0 ? (
            <p className="basket-empty">Ihr Warenkorb ist noch leer.</p>
          ) : (
            <>
              <ul className="basket-list">
                {items.map((item) => (
                  <li key={item.id} className="basket-item">
                    <div className="basket-item-info">
                      <strong>Hochbeet</strong>
                      <span className="basket-item-spec">
                        {item.length} × {item.depth} × {item.rows * 14} cm ·{' '}
                        {item.colorLabel}
                      </span>
                    </div>
                    <div className="basket-item-side">
                      <span className="basket-item-price">
                        {eur.format(item.price)}
                      </span>
                      <button
                        type="button"
                        className="basket-remove"
                        onClick={() => onRemove(item.id)}
                        aria-label="Artikel entfernen"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="basket-total">
                <span>Gesamt</span>
                <span>{eur.format(total)}</span>
              </div>
              <button type="button" className="basket-checkout">
                Zur Kasse
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function BasketIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 8h12l-1.2 11.3a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  )
}
