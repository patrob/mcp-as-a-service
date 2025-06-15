import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'
import { ConfigProvider } from './config/ConfigContext'
import { AuthProvider } from './auth/AuthContext'

const renderApp = () =>
  render(
    <ConfigProvider initialConfig={{ googleClientId: 'id' }}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ConfigProvider>,
  )

describe('App', () => {
  it('navigates to pricing page', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /pricing/i }))
    expect(screen.getByRole('heading', { name: /pricing/i })).toBeInTheDocument()
  })
})
