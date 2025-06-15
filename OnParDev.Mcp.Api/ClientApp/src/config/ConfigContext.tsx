import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'

export interface Config {
  googleClientId: string
}

const ConfigContext = createContext<Config | undefined>(undefined)

export const ConfigProvider: FC<{ children: ReactNode; initialConfig?: Config }> = ({ children, initialConfig }) => {
  const [config, setConfig] = useState<Config | undefined>(initialConfig)

  useEffect(() => {
    if (!initialConfig) {
      fetch('/api/config')
        .then((r) => r.json())
        .then(setConfig)
    }
  }, [initialConfig])

  if (!config) return null

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
}

export const useConfig = () => {
  const ctx = useContext(ConfigContext)
  if (!ctx) throw new Error('Config not loaded')
  return ctx
}
