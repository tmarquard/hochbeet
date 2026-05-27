import './App.css'
import { BedConfigurator } from './BedConfigurator'

function App() {
  return (
    <>
      <header className="site-header">
        <a href="/" className="site-brand">
          <img src="/logo.png" alt="BeetFreunde" className="site-logo" />
        </a>
      </header>
      <main>
        <BedConfigurator />
      </main>
    </>
  )
}

export default App
