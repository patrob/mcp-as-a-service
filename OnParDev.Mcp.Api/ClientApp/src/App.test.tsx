import { render, screen } from '@testing-library/react'
import App from './App'
import { ConfigProvider } from './config/ConfigContext'

describe('App', () => {
  it('renders the header', () => {
    render(
      <ConfigProvider initialConfig={{ googleClientId: 'id' }}>
        <App />
      </ConfigProvider>
    )
    expect(screen.getByRole('heading', { name: /MyMCP/i })).toBeInTheDocument()
  })
})
