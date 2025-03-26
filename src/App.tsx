import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Components
import MapGrid from "./components/MapGrid";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1 style={{ textAlign: "center" }}>Carte</h1>
        <MapGrid />
      </div>
    </>
  )
}

export default App
