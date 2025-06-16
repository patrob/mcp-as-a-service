import { createContext, FC, ReactNode, useContext, useState } from 'react'

export interface User {
  name: string
  picture: string
}

interface AuthContextValue {
  isAuthenticated: boolean
  user?: User
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: FC<{
  children: ReactNode
  initialAuth?: { isAuthenticated: boolean; user?: User }
}> = ({ children, initialAuth }) => {
  const [isAuthenticated, setAuthenticated] = useState(
    initialAuth?.isAuthenticated ?? false,
  )
  const [user, setUser] = useState<User | undefined>(initialAuth?.user)

  const login = (newUser: User) => {
    setAuthenticated(true)
    setUser(newUser)
  }

  const logout = () => {
    setAuthenticated(false)
    setUser(undefined)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('Auth not loaded')
  return ctx
}
