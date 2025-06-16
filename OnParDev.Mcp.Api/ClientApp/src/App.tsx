import { useEffect, useState } from 'react'
import './App.css'
import { useConfig } from './config/ConfigContext'
import Landing from './pages/Landing'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Pricing from './pages/Pricing'
import Contact from './pages/Contact'
import { useAuth } from './auth/AuthContext'
import Header from './layouts/Header'

function App() {
  useConfig()
  useAuth()
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = (newPath: string) => {
    window.history.pushState({}, '', newPath)
    setPath(newPath)
  }

  let content
  switch (path) {
    case '/signup':
      content = <SignUp />
      break
    case '/signin':
      content = <SignIn />
      break
    case '/pricing':
      content = <Pricing />
      break
    case '/contact':
      content = <Contact />
      break
    default:
      content = <Landing />
  }

  return (
    <>
      <Header navigate={navigate} />
      {content}
    </>
  )
}

export default App
