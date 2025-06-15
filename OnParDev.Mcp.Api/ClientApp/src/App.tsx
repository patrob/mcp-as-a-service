import './App.css'
import { useConfig } from './config/ConfigContext'

function App() {
  useConfig()
  return (
    <>
      <h1>MyMCP</h1>
      <p className="tagline">Model Context Protocol server as a service</p>
    </>
  )
}

export default App
