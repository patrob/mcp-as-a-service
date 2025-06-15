import { useEffect, useState } from 'react'
import './App.css'
import { useConfig } from './config/ConfigContext'
import Landing from './pages/Landing'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Pricing from './pages/Pricing'
import Contact from './pages/Contact'
import { useAuth } from './auth/AuthContext'

function App() {
  useConfig()
  const { isAuthenticated, logout } = useAuth()
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
      <nav>
        <button onClick={() => navigate('/')}>Home</button>
        {!isAuthenticated && (
          <>
            <button onClick={() => navigate('/signup')}>Sign Up</button>
            <button onClick={() => navigate('/signin')}>Sign In</button>
          </>
        )}
        <button onClick={() => navigate('/pricing')}>Pricing</button>
        <button onClick={() => navigate('/contact')}>Contact</button>
        {isAuthenticated && <button onClick={logout}>Logout</button>}
      </nav>
      {content}
    </>
  )
}

export default App
