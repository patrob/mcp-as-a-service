import { render, screen } from '@testing-library/react'
import { AuthProvider } from '../auth/AuthContext'
import Header from './Header'

test('shows profile photo when authenticated', () => {
  render(
    <AuthProvider
      initialAuth={{ isAuthenticated: true, user: { name: 'User', picture: 'pic' } }}
    >
      <Header navigate={() => {}} />
    </AuthProvider>,
  )
  expect(screen.getByAltText('User')).toBeInTheDocument()
})
