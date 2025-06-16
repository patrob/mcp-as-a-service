import { useAuth } from '../auth/AuthContext'

interface HeaderProps {
  navigate: (path: string) => void
}

function Header({ navigate }: HeaderProps) {
  const { isAuthenticated, logout, user } = useAuth()

  return (
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
      {isAuthenticated && (
        <>
          {user && <img src={user.picture} alt={user.name} />}
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  )
}

export default Header
