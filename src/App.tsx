import { useState } from 'react'
import './App.css'
import { BedConfigurator } from './BedConfigurator'
import { BasketButton } from './Basket'
import type { BasketItem } from './Basket'

function App() {
  const [basket, setBasket] = useState<BasketItem[]>([])

  const addToBasket = (config: Omit<BasketItem, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setBasket((prev) => [...prev, { id, ...config }])
  }

  const removeFromBasket = (id: string) => {
    setBasket((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <>
      <header className="site-header">
        <a href="/" className="site-brand">
          <img src="/logo.png" alt="BeetFreunde" className="site-logo" />
        </a>
        <BasketButton items={basket} onRemove={removeFromBasket} />
      </header>
      <main>
        <BedConfigurator onAddToBasket={addToBasket} />
      </main>
    </>
  )
}

export default App
