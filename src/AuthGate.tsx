import { useState } from 'react'
import type { FormEvent } from 'react'
import './AuthGate.css'

const PASSWORD = 'Thorsten'
const STORAGE_KEY = 'beetfreunde-auth'

export function isAuthenticated(): boolean {
  try {
    return (
      localStorage.getItem(STORAGE_KEY) === 'true' ||
      sessionStorage.getItem(STORAGE_KEY) === 'true'
    )
  } catch {
    return false
  }
}

interface Props {
  onSuccess: () => void
}

export function AuthGate({ onSuccess }: Props) {
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password === PASSWORD) {
      try {
        if (remember) {
          localStorage.setItem(STORAGE_KEY, 'true')
        } else {
          sessionStorage.setItem(STORAGE_KEY, 'true')
        }
      } catch {
        // Storage may be unavailable (private browsing); proceed anyway.
      }
      onSuccess()
    } else {
      setError(true)
    }
  }

  return (
    <div className="auth-gate">
      <form className="auth-card" onSubmit={handleSubmit}>
        <img src="/logo.png" alt="BeetFreunde" className="auth-logo" />
        <h1>Vorschau</h1>
        <p className="auth-intro">
          Diese Seite ist passwortgeschützt. Geben Sie das Passwort ein,
          um die Vorschau zu öffnen.
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (error) setError(false)
          }}
          placeholder="Passwort"
          className={`auth-input${error ? ' has-error' : ''}`}
          autoFocus
          autoComplete="current-password"
          aria-label="Passwort"
          aria-invalid={error}
        />

        <label className="auth-remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Angemeldet bleiben
        </label>

        {error && (
          <p className="auth-error" role="alert">
            Falsches Passwort.
          </p>
        )}

        <button type="submit" className="auth-submit">
          Vorschau öffnen
        </button>
      </form>
    </div>
  )
}
